const socketIo = require('socket.io');

class WebSocketManager {
    constructor(server) {
        this.signifyPlusSocketIo = socketIo(server, {
            cors: {origin: "*"}
        });
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        //debug when UI has setup for sending messages
        this.signifyPlusSocketIo.on('connection', (socket) => {
            console.log('Connected');
            socket.on('message', (message) => {
                console.log(message);
                this.signifyPlusSocketIo.emit('message', `${socket.id.substr(0,2)} said ${message}}`)
            })

            socket.on('disconnect', () => {
                console.log(`Socket with id ${socket.id.substr(0,2)} disconnected`);
            });
        })
    }
}

module.exports = WebSocketManager;


