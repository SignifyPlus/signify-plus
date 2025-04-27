class CommonConstants {
   static BUFFER_ENCODING = 'utf-8';
   static BASE_64 = 'base64'; //base64 encoding type
   static FIRST_ENTRY = 0;
   static S3_PRE_SIGNED_URL_EXPIRATION_TIME = 10 * 60; //10 minutes

   static MIME_TYPE_TO_EXTENTION_MAP = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/gif': '.gif',
      'image/bmp': '.bmp',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.ms-excel': '.xls',
      'application/zip': '.zip',
      'text/plain': '.txt',
      'text/html': '.html',
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'video/mp4': '.mp4',
      'video/quicktime': '.mov',
      'application/json': '.json',
   };
}

module.exports = CommonConstants;
