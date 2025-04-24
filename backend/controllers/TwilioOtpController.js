class TwilioOtpController {
   constructor() {}

   getOtp = async (request, response) => {
      try {
         json.reponse('');
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };

   verifyOtp = async (request, response) => {
      try {
         json.reponse('');
      } catch (exception) {
         response.status(500).json({ error: exception.message });
      }
   };
}

module.exports = TwilioOtpController;
