class AwsS3PresignedResponse {
   constructor(presignedUrl, publicUrl) {
      this.presignedUrl = presignedUrl;
      this.publicUrl = publicUrl;
   }
}

module.exports = AwsS3PresignedResponse;
