class WebSocketMessageDto {
   constructor(chatId, senderPhoneNumber, targetPhoneNumbers, message) {
      this.chatId = chatId;
      this.senderPhoneNumber = senderPhoneNumber;
      this.targetPhoneNumbers = targetPhoneNumbers;
      this.message = message;
   }
}

module.exports = WebSocketMessageDto;
