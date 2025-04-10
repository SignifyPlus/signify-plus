const io = require('socket.io-client');
require('dotenv').config();
const mockSocketUser1 = io('http://localhost:3001');
const mockSocketUser2 = io('http://localhost:3001');

//Mock User 1 for Message
mockSocketUser1.on('connect', () => {
   console.log(`Connected User 1 to MocketSocket ${'http://localhost:3001'}`);
   mockSocketUser1.emit('socket-registration', {
      userPhoneNumber: '030014124',
   });
   mockSocketUser1.emit('message', {
      senderPhoneNumber: '030014124',
      message: 'Hi, How are you!!',
      targetPhoneNumbers: ['123124325435'],
   });
});

mockSocketUser1.on('message', (message) => {
   console.log(`Incoming Message from Mock2: ${message}`);
   // mockSocketUser1.emit('message', {
   //     message: "Damn sexyyyy gay boi!!",
   //     senderPhoneNumber: "868578654",
   //     targetPhoneNumbers: ['868578654']
   // });
});

mockSocketUser1.on('disconnect', () => {
   console.log('Disconnected from server');
});

mockSocketUser1.on('message-failure', (data) => {
   console.log(`Message Failure: ${data.error}`);
});

//Mock User 2
mockSocketUser2.on('connect', () => {
   console.log(`Connected User 2 to MocketSocket ${'http://localhost:3001'}`);
   mockSocketUser2.emit('socket-registration', {
      userPhoneNumber: '123124325435',
   });
});

mockSocketUser2.on('message', (message) => {
   console.log(`Incoming Message from Mock1: ${message}`);
   mockSocketUser2.emit('message', {
      message: "I'm Good!, How are you!!",
      senderPhoneNumber: '123124325435',
      targetPhoneNumbers: ['030014124'],
   });
});

mockSocketUser2.on('disconnect', () => {
   console.log('Disconnected from server');
});

mockSocketUser2.on('message-failure', (data) => {
   console.log(`Message Failure: ${data.error}`);
});
