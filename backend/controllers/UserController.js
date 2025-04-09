const ServiceFactory = require('../factories/serviceFactory.js');
const LoggerFactory = require('../factories/loggerFactory.js');
const Encrypt = require('../utilities/encrypt.js');
const ExceptionHelper = require('../exception/ExceptionHelper.js');
const SignifyException = require('../exception/SignifyException.js');
const ControllerConstants = require('../constants/controllerConstants.js');
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
         response.json(user);
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
         response.json(user);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   //Creates a user
   createUser = async (request, response) => {
      try {
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
         const userObject =
            await ServiceFactory.getUserService.saveDocument(newUser);
         response.json(userObject);
      } catch (exception) {
         response.status(500).json({ error: exception.message });
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
}

module.exports = UserController;
