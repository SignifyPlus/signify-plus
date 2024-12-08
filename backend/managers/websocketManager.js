const socketIo = require('socket.io');
const MachineLearningTranslationManager = require('./machineLearningTranslationManager');

class WebSocketManager {
    constructor(server) {
        this.signifyPlusSocketIo = socketIo(server, {
            cors: {origin: "*"}
        });
        this.machineLearningTranslationManager = new MachineLearningTranslationManager(this.signifyPlusSocketIo)
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

            socket.on('offer', (data) => {
                console.log(`Offer from ${socket.id} to ${data.target}`);
                socket.to(data.target).emit('offer', {
                    sender: socket.id,
                    offer: data.offer
                });
            });

            socket.on('answer', (data) => {
                console.log(`Answer from ${socket.id} to ${data.target}`);
                socket.to(data.target).emit('answer', {
                    sender: socket.id,
                    answer: data.answer
                });
            });

            
            socket.on('ice-candidate', (data) => {
                console.log(`Ice Candidate from ${socket.id} to ${data.target}`);
                socket.to(data.target).emit('ice-candidate', {
                    sender: socket.id,
                    candidate: data.candidate
                });
            });


            socket.on('disconnect', () => {
                console.log(`Socket with id ${socket.id.substr(0,2)} disconnected`);
            });
        })
    }
}

module.exports = WebSocketManager;


