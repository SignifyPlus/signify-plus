const io = require('socket.io-client');
require("dotenv").config();
const mockSocketUser1 = io(process.env.RENDER_URL);
const mockSocketUser2 = io(process.env.RENDER_URL);


//Mock User 1 for Message
mockSocketUser1.on('connect', () => {
    console.log(`Connected to MocketSocket ${process.env.RENDER_URL}`);
})

mockSocketUser1.on('message', (message) => {
});

mockSocketUser1.on('disconnect', () => {
    console.log('Disconnected from server');
});

//Mock User 2
mockSocketUser2.on('connect', () => {
    console.log(`Connected to MocketSocket ${process.env.RENDER_URL}`);
})

mockSocketUser2.on('message', (message) => {
});

mockSocketUser2.on('disconnect', () => {
    console.log('Disconnected from server');
});
