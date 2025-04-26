class WebSocketMessageDto {
   constructor(chatId, senderPhoneNumber, targetPhoneNumbers, message, replyToId = null) {
      this.chatId = chatId;
      this.senderPhoneNumber = senderPhoneNumber;
      this.targetPhoneNumbers = targetPhoneNumbers;
      this.message = message;
      this.replyToId = replyToId; // ID of the message this is a reply to
   }
}

module.exports = WebSocketMessageDto;
