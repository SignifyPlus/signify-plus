import io from 'socket.io-client';
require('dotenv').config();
const mockSocketUser1 = io(process.env.RENDER_URL);
const mockSocketUser2 = io(process.env.RENDER_URL);

//Mock User 1
mockSocketUser1.on('connect', () => {
   console.log(`Connected to MocketSocket ${process.env.RENDER_URL}`);

   mockSocketUser1.emit('message', 'Hello from mock Client!');

   //we should not be broadcasting this to everyone
   //so we'll use senderId,
   //targets, the sender which wants to make a call to
   // and the meeting id
   mockSocketUser1.emit('socket-registration', {
      userPhoneNumber: '789067567', //user 1 registration from front end on connection
   });
   connectedUsers++;
   emitMeetingIdIfReady();
});

mockSocketUser1.on('message', (message) => {
   console.log(`Message Received From Server ${message}`);
});

mockSocketUser1.on('disconnect', () => {
   console.log('Disconnected from server');
});

mockSocketUser1.on('meeting-id-offer', (data) => {
   console.log(
      `Meeting ID Offer received from server ${data.sender} ${data.senderPhoneNumber} ${data.meetingId}`,
   );
});

mockSocketUser1.on('meeting-id-failed', (data) => {
   console.log(`Meeting ID Offer received from server ${data.sender}`);
   console.log(`Meeting ID: ${data.message}`);
});

mockSocketUser1.on('call-declined', (data) => {
   console.log(
      `Sorry call declined ${data.declinedUsersPhoneNumber} ${data.message}`,
   );
});

//Mock User 2
mockSocketUser2.on('connect', () => {
   console.log(`Connected to MocketSocket ${process.env.RENDER_URL}`);

   mockSocketUser2.emit('message', 'Hello from mock Client User2!');

   mockSocketUser2.emit('socket-registration', {
      userPhoneNumber: '213125466', //user 2 registration from front end on connection
   });
   connectedUsers++;
   emitMeetingIdIfReady();
});

mockSocketUser2.on('message', (message) => {
   console.log(`Message Received From Server ${message}`);
});

mockSocketUser2.on('disconnect', () => {
   console.log('Disconnected from server');
});

mockSocketUser2.on('meeting-id-offer', (data) => {
   console.log(
      `Meeting ID Offer received from server ${data.senderSocketId} ${data.senderPhoneNumber} ${data.meetingId}`,
   );
   mockSocketUser2.emit('meeting-id-decline', {
      userPhoneNumber: '213125466',
      meetingId: data.meetingId,
      targetPhoneNumber: data.senderPhoneNumber,
   });
});

mockSocketUser2.on('meeting-id-failed', (data) => {
   console.log(`Meeting ID Offer received from server ${data.senderSocketId}`);
   console.log(`Meeting ID: ${data.message}`);
});

mockSocketUser2.on('meeting-id-decline-failed', (data) => {
   console.log(
      `No target user found to forward the decline ${data.senderPhoneNumber} ${data.message}`,
   );
});

//Mock User 3
mockSocketUser3.on('connect', () => {
   console.log(`Connected to MocketSocket ${process.env.RENDER_URL}`);

   mockSocketUser3.emit('message', 'Hello from mock Client User3!');

   mockSocketUser3.emit('socket-registration', {
      userPhoneNumber: '12523643765', //user 3 registration from front end on connection
   });
   connectedUsers++;
   emitMeetingIdIfReady();
});

mockSocketUser3.on('message', (message) => {
   console.log(`Message Received From Server ${message}`);
});

mockSocketUser3.on('disconnect', () => {
   console.log('Disconnected from server');
});

mockSocketUser3.on('meeting-id-offer', (data) => {
   console.log(
      `Meeting ID Offer received from server ${data.senderSocketId} ${data.senderPhoneNumber} ${data.meetingId}`,
   );
});

mockSocketUser3.on('meeting-id-failed', (data) => {
   console.log(`Meeting ID Offer received from server ${data.senderSocketId}`);
   console.log(`Meeting ID: ${data.message}`);
});
