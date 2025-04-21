class AwsS3Dto {
   constructor(accessKey, secretAccessKey, region, bucketName, folderName) {
      this.accessKey = accessKey;
      this.secretAccessKey = secretAccessKey;
      this.region = region;
      this.bucketName = bucketName;
      this.folderName = folderName;
   }
}

module.exports = AwsS3Dto;
