require('dotenv').config();
const AwsS3 = require('./models/AwsS3.js');
const S3Client = require('@aws-sdk/client-s3');
const S3RequestPresigner = require('@aws-sdk/s3-request-presigner');
const CommonConstants = require('../../constants/commonConstants.js');
const LoggerFactory = require('../../factories/loggerFactory.js');
const AwsS3PresignedResponse = require('./models/AwsS3PresignedResponse.js');
class AwsS3Manager {
   /**
    * @type {AwsS3 | null}
    */
   #awsS3Dto = null;
   /**
    * @type {S3Client.S3 | null}
    */
   #awsS3Connection = null;
   constructor() {
      this.#createAwsS3Dto();
   }

   async #createAwsS3Dto() {
      LoggerFactory.getApplicationLogger.info(
         `Pulling in AWS S3 information...`,
      );
      if (
         process.env.AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_ACCESS_KEY_ENCRYPTED ==
            null ||
         process.env
            .AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_SECRET_ACCESS_KEY_ENCRYPTED ==
            null ||
         process.env.AWS_S3_BUCKET_REGION == null ||
         process.env.AWS_S3_BUCKET_NAME == null ||
         process.env.AWS_S3_BUCKET_PROFILE_PICTURES_FOLDER_NAME == null
      ) {
         LoggerFactory.getApplicationLogger
            .error(`One or more environment variables are not set: {AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_ACCESS_KEY_ENCRYPTED} 
                {AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_SECRET_ACCESS_KEY_ENCRYPTED} {AWS_S3_BUCKET_REGION} {AWS_S3_BUCKET_NAME} {AWS_S3_BUCKET_PROFILE_PICTURES_FOLDER_NAME} -- kindly check!`);
         return;
      }

      this.#awsS3Dto = new AwsS3(
         Buffer.from(
            process.env.AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_ACCESS_KEY_ENCRYPTED,
            CommonConstants.BASE_64,
         ).toString(CommonConstants.BUFFER_ENCODING),
         Buffer.from(
            process.env
               .AWS_IAM_SIGNIFY_PLUS_BACKEND_USER_SECRET_ACCESS_KEY_ENCRYPTED,
            CommonConstants.BASE_64,
         ).toString(CommonConstants.BUFFER_ENCODING),
         process.env.AWS_S3_BUCKET_REGION,
         process.env.AWS_S3_BUCKET_NAME,
         process.env.AWS_S3_BUCKET_PROFILE_PICTURES_FOLDER_NAME,
      );
   }

   async initiateS3Connection() {
      LoggerFactory.getApplicationLogger.info(`Initializing S3 connection...`);
      this.#awsS3Connection = new S3Client.S3({
         credentials: {
            accessKeyId: this.#awsS3Dto.accessKey,
            secretAccessKey: this.#awsS3Dto.secretAccessKey,
         },
         region: this.#awsS3Dto.region,
      });
   }

   get getAwsS3Dto() {
      return this.#awsS3Dto;
   }

   get getAwsS3Connection() {
      return this.#awsS3Connection;
   }

   async generatePresignedS3ProfilePictureUploadUrl(fileName, mimeTye) {
      return this.#generatePresignedS3UploadUrl(
         this.#awsS3Dto.folderName,
         fileName,
         mimeTye,
      );
   }

   async #generatePresignedS3UploadUrl(folderName, fileName, mimeTye) {
      const awsS3Parameters = {
         Bucket: this.#awsS3Dto.bucketName,
         Key: `${folderName}/${fileName}`,
         ContentType: mimeTye,
      };
      const putObjectCommand = new S3Client.PutObjectCommand(awsS3Parameters);
      const uploadUrl = await S3RequestPresigner.getSignedUrl(
         this.#awsS3Connection,
         putObjectCommand,
         { expiresIn: CommonConstants.S3_PRE_SIGNED_URL_EXPIRATION_TIME },
      );
      const publicUrl =
         (await this.#generatePublicS3BaseUrl()) + '/' + fileName;
      const awsS3PresignedResponse = new AwsS3PresignedResponse(
         uploadUrl,
         publicUrl,
      );
      LoggerFactory.getApplicationLogger.info(
         `Generated presigned URL: ${JSON.stringify(awsS3PresignedResponse)}`,
      );
      return awsS3PresignedResponse;
   }

   async #generatePublicS3BaseUrl() {
      return `https://${this.#awsS3Dto.bucketName}.s3.${this.#awsS3Dto.region}.amazonaws.com/${this.#awsS3Dto.folderName}`;
   }
}

module.exports = AwsS3Manager;
