class AuthConstants {
   static AUTH_USERS_LOGIN = '/auth/users/login';
   static AUTH_USERS_CREATE = '/auth/users/create';
   static JWT_REFRESH = '/jwt/refresh';
   static AUTHORIZATION_HEADER = 'authorization';
   static TWILIO_VERIFY = '/twilio/verifyOtp';
   static UPDATE_USER = '/users/update';

   static TWILIO_GET = '/twilio/getOtp';
   static FIRST = 1;
   static UNAUTHORIZED = 401;
   static ZERO = 0;
}
module.exports = AuthConstants;
