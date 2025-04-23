const io = require('socket.io-client');
require('dotenv').config();
const mockSocketUser1 = io('http://localhost:3001');
const mockSocketUser2 = io('http://localhost:3001');
const mockSocketUser3 = io('http://localhost:3001');

//Mock User 1
mockSocketUser1.on('connect', async () => {
   console.log(`Connected to MocketSocket http://localhost:3001`);

   mockSocketUser1.emit('socket-registration', {
      userPhoneNumber: '789067567', //user 1 registration from front end on connection
   });

   await new Promise((resolve) => setTimeout(resolve, 1000));

   mockSocketUser1.emit('meeting-id', {
      userPhoneNumber: '789067567',
      meetingId: '412532646',
      targetPhoneNumbers: ['213125466', '12415135135'],
      isVoiceCall: false,
   });
});

mockSocketUser1.on('disconnect', () => {
   console.log('mockSocketUser1 Disconnected from server');
});

mockSocketUser1.on('meeting-id-offer', (data) => {
   console.log(
      `Meeting ID Offer received from server socket: ${data.senderSocketId} sender: ${data.senderPhoneNumber} meetingId: ${data.meetingId} isVoiceCall: ${data.isVoiceCall}`,
   );
});

mockSocketUser1.on('meeting-id-failed', (data) => {
   console.log(`Meeting ID Offer received from server ${data.sender}`);
   console.log(`Meeting ID: ${data.message}`);
});

mockSocketUser1.on('call-declined', (data) => {
   console.log(`${data.declinedUsersPhoneNumber} ${data.message}`);
});

mockSocketUser1.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mock user1: ${JSON.stringify(data)}`);
});

//Mock User 2
mockSocketUser2.on('connect', () => {
   console.log(`Connected to MocketSocket http://localhost:3001`);

   mockSocketUser2.emit('socket-registration', {
      userPhoneNumber: '213125466', //user 2 registration from front end on connection
   });
});

mockSocketUser2.on('disconnect', () => {
   console.log('mockSocketUser2 Disconnected from server');
});

mockSocketUser2.on('meeting-id-offer', (data) => {
   console.log(
      `Meeting ID Offer received from server socket: ${data.senderSocketId} sender: ${data.senderPhoneNumber} meetingId: ${data.meetingId} isVoiceCall: ${data.isVoiceCall}`,
   );
   mockSocketUser2.emit('meeting-id-decline', {
      userPhoneNumber: '213125466',
      targetPhoneNumber: data.senderPhoneNumber,
      meetingId: data.meetingId,
   });

   //emit disconnect event

   mockSocketUser2.disconnect();
});

mockSocketUser2.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mock user2: ${data}`);
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
   console.log(`Connected to MocketSocket http://localhost:3001`);

   mockSocketUser3.emit('socket-registration', {
      userPhoneNumber: '12415135135', //user 2 registration from front end on connection
   });
});

mockSocketUser3.on('disconnect', () => {
   console.log('mockSocketUser3 disconnected from server');
});

mockSocketUser3.on('meeting-id-offer', (data) => {
   console.log(
      `Meeting ID Offer received from server socket: ${data.senderSocketId} sender: ${data.senderPhoneNumber} meetingId: ${data.meetingId} isVoiceCall: ${data.isVoiceCall}`,
   );
});

mockSocketUser3.on('meeting-id-failed', (data) => {
   console.log(`Meeting ID Offer received from server ${data.senderSocketId}`);
   console.log(`Meeting ID: ${data.message}`);
});

mockSocketUser3.on('meeting-id-decline-failed', (data) => {
   console.log(
      `No target user found to forward the decline ${data.senderPhoneNumber} ${data.message}`,
   );
});

mockSocketUser3.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mock user3: ${JSON.stringify(data)}`);
});
