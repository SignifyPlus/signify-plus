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
   mockSocketUser1.emit('voice-call', {
      senderPhoneNumber: '+90123456789',
      targetPhoneNumbers: ['+49123456789'],
   });
});

mockSocketUser1.on('incoming-call', (data) => {});

mockSocketUser1.on('decline', (data) => {});

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

mockSocketUser2.on('incoming-call', (data) => {});

mockSocketUser2.on('decline', (data) => {});

mockSocketUser2.on('disconnect', () => {
   console.log('Disconnected from server');
});
