class CommonConstants {
   static BUFFER_ENCODING = 'utf-8';
   static BASE_64 = 'base64'; //base64 encoding type
   static FIRST_ENTRY = 0;
   static S3_PRE_SIGNED_URL_EXPIRATION_TIME = 10 * 60; //10 minutes

   static EXTENSION_DOT = '.';

   static EXTENSION_TO_MIME_TYPE_MAP = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.xls': 'application/vnd.ms-excel',
      '.zip': 'application/zip',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.json': 'application/json',
   };
}

module.exports = CommonConstants;
