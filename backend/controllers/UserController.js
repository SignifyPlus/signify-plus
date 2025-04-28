const ServiceFactory = require('../factories/serviceFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const Encrypt = require('../utilities/encrypt.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const EventDispatcher = require('../events/eventDispatcher.js');
const SignifyException = require('../exception/SignifyException.js');
const ControllerConstants = require('../constants/controllerConstants.js');
const EventConstants = require('../constants/eventConstants.js');
const UpdateUserDto = require('../dtos/UpdateUserDto.js');
const SignifyResult = require('../dtos/SignifyResult.js');
const ManagerFactory = require('../factories/managerFactory.js');
class UserController {
   #saltRoundForEncryption = null;
   constructor() {
      this.#saltRoundForEncryption =
         ControllerConstants.SALT_ROUND_FOR_USERS_CONTROLLER;
   }

   //Get all Users
   getAllUsers = async (request, response) => {
      try {
         LoggerFactory.getApplicationLogger.info(
            'Fetching all users from the getAllUsers endpoint...',
         );
         const users = await ServiceFactory.getUserService.getDocuments();
         response.json(users);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get single user
   getUserById = async (request, response) => {
      try {
         LoggerFactory.getApplicationLogger.info(
            'Fetching the user from the getUserById endpoint...',
         );
         const userId = request.params.id;
         const user =
            await ServiceFactory.getUserService.getDocumentById(userId);
         response.json(user);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Get a single User by PhoneNumber
   getUserByPhoneNumber = async (request, response) => {
      try {
         LoggerFactory.getApplicationLogger.info(
            `Fetching the user with the Phone Number ${request.params.phoneNumber}`,
         );
         const phoneNumber = request.params.phoneNumber;
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `User does not exist in the database`,
            response,
         );
         if (userValidation) return userValidation;
         const userAuthenticationResult =
            await this.#getUserAuthenticationRecord(user);

         if (userAuthenticationResult.exception) {
            return response
               .status(userAuthenticationResult.exception.status)
               .json(userAuthenticationResult.exception.loadResult());
         }
         //add the authenticationrecord - converts the mongoose document to an object, and then add the authentication record (with the same name)
         //spreads over all the properties of user object first
         const authenticationData = userAuthenticationResult.data;
         const finalUser = { ...user.toObject(), authenticationData };
         response.json(finalUser);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   getUserByPhoneNumberForLogin = async (request, response) => {
      try {
         const phoneNumberValidation = await ExceptionHelper.validate(
            request.body.phoneNumber,
            400,
            `phoneNumber is not provided.`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;
         const passwordValidation = await ExceptionHelper.validate(
            request.body.password,
            400,
            `password is not provided.`,
            response,
         );
         if (passwordValidation) return passwordValidation;
         const user =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.phoneNumber,
            });
         const userValidation = await ExceptionHelper.validate(
            user,
            400,
            `User does not exist in the database`,
            response,
         );
         if (userValidation) return userValidation;
         const doesPasswordMatch = await Encrypt.compare(
            request.body.password,
            user.password,
         );
         if (!doesPasswordMatch) {
            const signifyException = new SignifyException(
               401,
               `Passwords don't match!`,
            );
            return response
               .status(signifyException.status)
               .json(signifyException.loadResult());
         }

         //generate tokens
         const accessToken =
            await ManagerFactory.getJwtManager().generateAccessToken(
               user._id.toString(),
            );
         const refreshToken =
            await ManagerFactory.getJwtManager().generateRefreshToken(
               user._id.toString(),
            );

         const authenticationData = await EventDispatcher.dispatchEvent(
            EventConstants.USER_AUTHENTICATION_UPDATE_EVENT,
            { userId: user._id.toString(), refreshToken: refreshToken },
         );

         // const userAuthenticationResult =
         //    await this.#getUserAuthenticationRecord(user);
         // if (userAuthenticationResult.exception) {
         //    return response
         //       .status(userAuthenticationResult.exception.status)
         //       .json(userAuthenticationResult.exception.loadResult());
         // }
         // const authenticationData = userAuthenticationResult.data;
         const finalUser = {
            ...user.toObject(),
            authenticationData,
            accessToken,
         };
         response.json(finalUser);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Creates a user
   createUser = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const newUser = request.body;
         const nameValidation = await ExceptionHelper.validate(
            newUser.name,
            400,
            `name is not provided.`,
            response,
         );
         if (nameValidation) return nameValidation;
         const phoneNumberValidation = await ExceptionHelper.validate(
            newUser.phoneNumber,
            400,
            `phoneNumber is not provided.`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;
         const passwordValidation = await ExceptionHelper.validate(
            newUser.password,
            400,
            `password is not provided.`,
            response,
         );
         if (passwordValidation) return passwordValidation;
         //encrypt password
         newUser.password = await Encrypt.encrypt(
            this.#saltRoundForEncryption,
            newUser.password,
         );
         const userObject = await ServiceFactory.getUserService.saveDocument(
            newUser,
            mongooseSession,
         );

         //TODO - tie to a single transaction
         //use event-driven approach to also create user settings (via an event)
         EventDispatcher.dispatchEvent(
            EventConstants.ACCESSIBILITY_SETTINGS_EVENT,
            userObject[ControllerConstants.ZERO_INDEX]._id.toString(),
         );

         //TODO - tie to a single transaction
         //use event-driven approach to also create default user authentication record (via an event)
         //(if want to use the result, simply use await to wait for the result which will be returned by the event :))
         EventDispatcher.dispatchEvent(
            EventConstants.USER_AUTHENTICAITON_EVENT,
            userObject[ControllerConstants.ZERO_INDEX]._id.toString(),
         );

         //commit the transaction
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         response.json(userObject);
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };

   //updates a user
   updateUser = async (request, response) => {
      var mongooseSession = null;
      try {
         mongooseSession =
            await ServiceFactory.getMongooseService.getMongooseSession();
         await ServiceFactory.getMongooseService.startMongooseTransaction(
            mongooseSession,
         );
         const phoneNumberValidation = await ExceptionHelper.validate(
            request.body.phoneNumber,
            400,
            `phoneNumber is not provided in the request.`,
            response,
         );
         if (phoneNumberValidation) return phoneNumberValidation;

         const existingUserObject =
            await ServiceFactory.getUserService.getDocumentByCustomFilters({
               phoneNumber: request.body.phoneNumber,
            });

         const userObjectValidation = await ExceptionHelper.validate(
            existingUserObject,
            400,
            `No such user exists with the phoneNumber: ${request.body.phoneNumber}`,
            response,
         );

         if (userObjectValidation) return userObjectValidation;

         const updateUserDto = new UpdateUserDto(
            existingUserObject._id.toString(),
            request.body?.name,
            request.body?.phoneNumber,
            request.body?.profilePicture,
            request.body?.password,
            request.body?.profileStatus,
         );

         //encrypt the new password
         if (
            updateUserDto.password != null ||
            updateUserDto.password != undefined
         ) {
            updateUserDto.password = await Encrypt.encrypt(
               this.#saltRoundForEncryption,
               updateUserDto.password,
            );
         }

         LoggerFactory.getApplicationLogger.info(
            `Updating the userData with the id: ${updateUserDto.userId}`,
         );
         const updatedUserData =
            await ServiceFactory.getUserService.updateDocument(
               {
                  _id: updateUserDto.userId,
               },
               {
                  name:
                     updateUserDto.name == null
                        ? existingUserObject.name
                        : updateUserDto.name,
                  phoneNumber:
                     updateUserDto.phoneNumber == null
                        ? existingUserObject.phoneNumber
                        : updateUserDto.phoneNumber,
                  password:
                     updateUserDto.password == null
                        ? existingUserObject.password
                        : updateUserDto.password,
                  profilePicture:
                  updateUserDto.profilePicture == null
                     ? existingUserObject.profilePicture
                     : updateUserDto.profilePicture,
                  profileStatus:
                     updateUserDto.profileStatus == null
                        ? existingUserObject.profileStatus
                        : updateUserDto.profileStatus,

                  updatedAt: Date.now(),
               },
               mongooseSession,
            );

         //commit the transaction
         await ServiceFactory.getMongooseService.commitMongooseTransaction(
            mongooseSession,
         );
         response.json(updatedUserData);
      } catch (exception) {
         await ServiceFactory.getMongooseService.abandonMongooseTransaction(
            mongooseSession,
         );
         const signifyException = new SignifyException(
            500,
            `Exception Occured: ${exception.message}`,
         );
         return response
            .status(signifyException.status)
            .json(signifyException.loadResult());
      }
   };

   //Deletes a user
   deleteUser = async (request, response) => {
      try {
         const filters = request.query;
         LoggerFactory.getApplicationLogger.info('Filters: ', filters);
         LoggerFactory.getApplicationLogger.info('Keys', Object.keys(filters));
         const userObject =
            await ServiceFactory.getUserService.deleteDocument(filters);
         response.json(userObject);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Deletes a user
   deleteUserById = async (request, response) => {
      try {
         const userId = request.params.id;
         LoggerFactory.getApplicationLogger.info(userId);
         const userObject =
            await ServiceFactory.getUserService.deleteDocumentById(userId);
         response.json(userObject);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   async #getUserAuthenticationRecord(user) {
      const userAuthenticationRecord =
         await ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters(
            {
               userId: user._id.toString(),
            },
         );
      const userAuthenticationRecordValidation = await ExceptionHelper.validate(
         userAuthenticationRecord,
         400,
         `UserAuthentication does not exist for the user: ${user._id.toString()}`,
      );
      if (userAuthenticationRecordValidation) {
         return new SignifyResult(null, signifyException);
      }

      return new SignifyResult(userAuthenticationRecord);
   }
}

module.exports = UserController;
