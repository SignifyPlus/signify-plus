const io = require('socket.io-client');
require('dotenv').config();
const mockSocketUser1 = io('http://localhost:3001');
const mockSocketUser2 = io('http://localhost:3001');
const mockSocketUser3 = io('http://localhost:3001');

//diff users
const mockSocketUser4 = io('http://localhost:3001');
const mockSocketUser5 = io('http://localhost:3001');
const mockSocketUser6 = io('http://localhost:3001');

//Mock User 1
mockSocketUser1.on('connect', async () => {
   console.log(
      `mockSocketUser1 connected to MocketSocket http://localhost:3001`,
   );

   mockSocketUser1.emit('socket-registration', {
      userPhoneNumber: '+905343096627', //user 1 registration from front end on connection
   });

   await new Promise((resolve) => setTimeout(resolve, 1000));

   mockSocketUser1.emit('meeting-id', {
      userPhoneNumber: '+905343096627',
      callinitiator: '+905343096627',
      meetingId: '412532646',
      targetPhoneNumbers: ['+905343096626', '+905343096625'],
      isVoiceCall: false,
      isOnCall: true, //should be defaulted to true for the one who started the call
   });

   //declining from the first user
   //who initiated the call
   // mockSocketUser1.emit('meeting-id-decline', {
   //    userPhoneNumber: '+905343096627',
   //    meetingId: '412532646',
   //    targetPhoneNumbers: ['+905343096626', '+905343096625'],
   // });

   await new Promise((resolve) => setTimeout(resolve, 5000));

   mockSocketUser1.disconnect();
});

mockSocketUser1.on('disconnect', () => {
   console.log('mockSocketUser1 Disconnected from server');
});

mockSocketUser1.on('meeting-id-offer', (data) => {
   console.log(
      `mockSocketUser1 Meeting ID Offer received from server socket: ${data.senderSocketId} sender: ${data.senderPhoneNumber} meetingId: ${data.meetingId} isVoiceCall: ${data.isVoiceCall}`,
   );
});

mockSocketUser1.on('meeting-id-failed', (data) => {
   console.log(`mockSocketUser1 Meeting ID Failed ${JSON.stringify(data)}`);
});

mockSocketUser1.on('call-declined', (data) => {
   console.log(
      `mockSocketUser1 Call declined from: ${data.declinedUsersPhoneNumber}`,
   );
});

mockSocketUser1.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mock user1: ${JSON.stringify(data)}`);
});

//Mock User 2
mockSocketUser2.on('connect', () => {
   console.log(
      `mockSocketUser2 Connected to MocketSocket http://localhost:3001`,
   );

   mockSocketUser2.emit('socket-registration', {
      userPhoneNumber: '+905343096626', //user 2 registration from front end on connection
   });
});

mockSocketUser2.on('disconnect', () => {
   console.log('mockSocketUser2 Disconnected from server');
});

mockSocketUser2.on('meeting-id-offer', async (data) => {
   console.log(
      `mockSocketUser2 Meeting ID Offer received from server socket: ${JSON.stringify(data)}`,
   );
   // mockSocketUser2.emit('meeting-id-decline', {
   //    userPhoneNumber: '+905343096626',
   //    targetPhoneNumbers: data.targetPhoneNumbers,
   //    meetingId: data.meetingId,
   // });

   //emit disconnect event
   // mockSocketUser2.disconnect();

   mockSocketUser2.emit('meeting-accepted', {
      userPhoneNumber: '+905343096626',
      meetingId: data.meetingId,
      isVoiceCall: data.isVoiceCall,
      isOnCall: true,
      callinitiator: data.callinitiator,
      targetPhoneNumbers: data.targetPhoneNumbers,
   });

   await new Promise((resolve) => setTimeout(resolve, 4000));

   mockSocketUser2.disconnect();
});

mockSocketUser2.on('call-declined', (data) => {
   console.log(
      `mockSocketUser2 Call declined from: ${data.declinedUsersPhoneNumber}`,
   );
});

mockSocketUser2.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mock user2: ${data}`);
});

mockSocketUser2.on('meeting-id-failed', (data) => {
   console.log(`mockSocketUser2 Meeting ID Failed ${JSON.stringify(data)}`);
});

mockSocketUser2.on('meeting-id-decline-failed', (data) => {
   console.log(
      `mockSocketUser2 No target user found to forward the decline ${data.senderPhoneNumber} ${data.message}`,
   );
});

//Mock User 3
mockSocketUser3.on('connect', () => {
   console.log(
      `mockSocketUser3 Connected to MocketSocket http://localhost:3001`,
   );

   mockSocketUser3.emit('socket-registration', {
      userPhoneNumber: '+905343096625', //user 2 registration from front end on connection
   });
});

mockSocketUser3.on('disconnect', () => {
   console.log('mockSocketUser3 disconnected from server');
});

mockSocketUser3.on('meeting-id-offer', async (data) => {
   console.log(
      `mockSocketUser3 Meeting ID Offer received from server socket: ${JSON.stringify(data)}`,
   );
   mockSocketUser3.emit('meeting-accepted', {
      userPhoneNumber: '+905343096625',
      meetingId: data.meetingId,
      isVoiceCall: data.isVoiceCall,
      callinitiator: data.callinitiator,
      isOnCall: true,
      targetPhoneNumbers: data.targetPhoneNumbers,
   });

   await new Promise((resolve) => setTimeout(resolve, 4000));

   mockSocketUser3.disconnect();
});

mockSocketUser3.on('meeting-id-failed', (data) => {
   console.log(
      `mockSocketUser3 Meeting ID Failed ${JSON.stringify(data)}
      }`,
   );
});

mockSocketUser3.on('meeting-id-decline-failed', (data) => {
   console.log(
      `mockSocketUser3 No target user found to forward the decline ${data.senderPhoneNumber} ${data.message}`,
   );
});

mockSocketUser3.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mock user3: ${JSON.stringify(data)}`);
});

mockSocketUser3.on('call-declined', (data) => {
   console.log(
      `mockSocketUser3 Call declined from: ${data.declinedUsersPhoneNumber}`,
   );
});

//simulating second meeting ID

//Mock User 4
mockSocketUser4.on('connect', async () => {
   console.log(
      `mockSocketUser4 connected to MocketSocket http://localhost:3001`,
   );

   mockSocketUser4.emit('socket-registration', {
      userPhoneNumber: '+905343096624', //user 1 registration from front end on connection
   });

   await new Promise((resolve) => setTimeout(resolve, 2000));

   mockSocketUser4.emit('meeting-id', {
      userPhoneNumber: '+905343096624',
      meetingId: '125125126126',
      targetPhoneNumbers: ['+905343096623', '+905343096622'],
      isVoiceCall: false,
      callinitiator: '+905343096624',
      isOnCall: true, //should be defaulted to true for the one who started the call
   });

   //declining from the first user
   //who initiated the call
   // mockSocketUser4.emit('meeting-id-decline', {
   //    userPhoneNumber: '+905343096624',
   //    meetingId: '125125126126',
   //    targetPhoneNumbers: ['+905343096623'],
   // });

   await new Promise((resolve) => setTimeout(resolve, 3000));

   mockSocketUser4.disconnect();
});

mockSocketUser4.on('disconnect', () => {
   console.log('mockSocketUser4 Disconnected from server');
});

mockSocketUser4.on('meeting-id-offer', (data) => {
   console.log(
      `mockSocketUser4 Meeting ID Offer received from server socket: ${data.senderSocketId} sender: ${data.senderPhoneNumber} meetingId: ${data.meetingId} isVoiceCall: ${data.isVoiceCall}`,
   );
});

mockSocketUser4.on('meeting-id-failed', (data) => {
   console.log(`mockSocketUser4 ${JSON.stringify(data)}`);
});

mockSocketUser4.on('call-declined', (data) => {
   console.log(
      `mockSocketUser4 Call declined from: ${data.declinedUsersPhoneNumber}`,
   );
});

mockSocketUser4.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mockSocketUser4: ${JSON.stringify(data)}`);
});

//Mock User 5
mockSocketUser5.on('connect', () => {
   console.log(
      `mockSocketUser5 Connected to MocketSocket http://localhost:3001`,
   );

   mockSocketUser5.emit('socket-registration', {
      userPhoneNumber: '+905343096623', //user 2 registration from front end on connection
   });
});

mockSocketUser5.on('disconnect', () => {
   console.log('mockSocketUser5 Disconnected from server');
});

mockSocketUser5.on('meeting-id-offer', async (data) => {
   console.log(
      `mockSocketUser5 Meeting ID Offer received from server socket: ${JSON.stringify(data)}`,
   );
   mockSocketUser5.emit('meeting-id-decline', {
      userPhoneNumber: '+905343096623',
      meetingId: data.meetingId,
      isVoiceCall: data.isVoiceCall,
      isOnCall: false,
      callinitiator: data.callinitiator,
      targetPhoneNumbers: data.targetPhoneNumbers,
   });

   // mockSocketUser5.emit('meeting-accepted', {
   //    userPhoneNumber: '+905343096623',
   //    meetingId: data.meetingId,
   //    isVoiceCall: data.isVoiceCall,
   //    isOnCall: true,
   //    callinitiator: data.callinitiator,
   //    targetPhoneNumbers: data.targetPhoneNumbers,
   // });

   //simulate that the user is on call
   await new Promise((resolve) => setTimeout(resolve, 2000));

   //emit disconnect event
   mockSocketUser5.disconnect();
});

mockSocketUser5.on('call-declined', (data) => {
   console.log(
      `mockSocketUser5 Call declined from: ${data.declinedUsersPhoneNumber}`,
   );
});

mockSocketUser5.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mockSocketUser5: ${data}`);
});

mockSocketUser5.on('meeting-id-failed', (data) => {
   console.log(`mockSocketUser5 Meeting ID Failed ${JSON.stringify(data)}`);
});

mockSocketUser5.on('meeting-id-decline-failed', (data) => {
   console.log(
      `mockSocketUser5 No target user found to forward the decline ${data.senderPhoneNumber} ${data.message}`,
   );
});

//Mock User 6
mockSocketUser6.on('connect', () => {
   console.log(
      `mockSocketUser6 Connected to MocketSocket http://localhost:3001`,
   );

   mockSocketUser6.emit('socket-registration', {
      userPhoneNumber: '+905343096622', //user 2 registration from front end on connection
   });
});

mockSocketUser6.on('disconnect', () => {
   console.log('mockSocketUser6 Disconnected from server');
});

mockSocketUser6.on('meeting-id-offer', async (data) => {
   console.log(
      `mockSocketUser6 Meeting ID Offer received from server socket: ${JSON.stringify(data)}`,
   );
   mockSocketUser6.emit('meeting-id-decline', {
      userPhoneNumber: '+905343096622',
      meetingId: data.meetingId,
      isVoiceCall: data.isVoiceCall,
      isOnCall: false,
      callinitiator: data.callinitiator,
      targetPhoneNumbers: data.targetPhoneNumbers,
   });

   // mockSocketUser5.emit('meeting-accepted', {
   //    userPhoneNumber: '+905343096623',
   //    meetingId: data.meetingId,
   //    isVoiceCall: data.isVoiceCall,
   //    isOnCall: true,
   //    callinitiator: data.callinitiator,
   //    targetPhoneNumbers: data.targetPhoneNumbers,
   // });

   //simulate that the user is on call
   await new Promise((resolve) => setTimeout(resolve, 3000));

   //emit disconnect event
   mockSocketUser6.disconnect();
});

mockSocketUser6.on('call-declined', (data) => {
   console.log(
      `mockSocketUser6 Call declined from: ${data.declinedUsersPhoneNumber}`,
   );
});

mockSocketUser6.on('user-disconnected-from-meeting', (data) => {
   console.log(`For mockSocketUser6: ${JSON.stringify(data)}`);
});

mockSocketUser6.on('meeting-id-failed', (data) => {
   console.log(`mockSocketUser6 Meeting ID Failed ${JSON.stringify(data)}`);
});

mockSocketUser6.on('meeting-id-decline-failed', (data) => {
   console.log(
      `mockSocketUser6 No target user found to forward the decline ${data.senderPhoneNumber} ${data.message}`,
   );
});
