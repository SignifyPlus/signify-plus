const io = require('socket.io-client');
require('dotenv').config();
const mockSocketUser1 = io('http://localhost:3001');
const mockSocketUser2 = io('http://localhost:3001');

//Mock User 1 for Voice call
mockSocketUser1.on('connect', () => {
   console.log(`Connected User 1 to MocketSocket ${'http://localhost:3001'}`);
   mockSocketUser1.emit('socket-registration', {
      userPhoneNumber: '+90123456789',
   });
   mockSocketUser1.emit('voice-call-initiated', {
      senderPhoneNumber: '+90123456789',
      targetPhoneNumbers: ['+49123456789'],
   });
});

mockSocketUser1.on('incoming-call', (data) => {
   console.log(data);
});

mockSocketUser1.on('incoming-call-resolution', (data) => {
   console.log(data);
});

mockSocketUser1.on('disconnect', () => {
   console.log('Disconnected from server');
});

//Mock User 2 for Voice call
mockSocketUser2.on('connect', () => {
   console.log(`Connected User 2 to MocketSocket ${'http://localhost:3001'}`);
   mockSocketUser2.emit('socket-registration', {
      userPhoneNumber: '+49123456789',
   });
});

mockSocketUser2.on('incoming-call', (data) => {
   console.log(data);
   //if for example, user presses on the green button,
   //we want to inform the other user of the resolution of the call: accepted/declined
   mockSocketUser2.emit('incoming-call-resolution', {
      targetPhoneNumber: data.senderPhoneNumber,
      accepted: false, //call accepted in case of true bool value; if false, call declined
   });
});

mockSocketUser2.on('incoming-call-resolution', (data) => {
   console.log(data);
});

mockSocketUser2.on('disconnect', () => {
   console.log('Disconnected from server');
});
