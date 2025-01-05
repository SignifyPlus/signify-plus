const socketIo = require('socket.io');
const MachineLearningTranslationManager = require('./machineLearningTranslationManager');

class WebSocketManager {
    constructor(server) {
        this.signifyPlusSocketIo = socketIo(server, {
            cors: {origin: "*"}
        });
        this.userSocketMap = {};
        this.machineLearningTranslationManager = new MachineLearningTranslationManager(this.signifyPlusSocketIo)
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.signifyPlusSocketIo.on('connection', (socket) => {
            console.log('Connected');
            socket.on('message', (message) => {
                console.log(message);
                this.signifyPlusSocketIo.emit('message', `${socket.id} said ${message}}`)
            })

            socket.on('socket-registration', (data) => {
                //add userID and the socket id to the map
                this.userSocketMap[data.userPhoneNumber] = socket.id;
                console.log(`User ${data.userPhoneNumber} registered with socket ID: ${socket.id}`);
            })
            
            socket.on('meeting-id', (data) => {
                const sendersSocketId = this.userSocketMap[data.userPhoneNumber];
                if (!sendersSocketId) { //if sender is undefined, exit
                    return;
                }
                console.log(`Meeting ID: ${data.meetingId} callerUserId: ${data.userPhoneNumber} sendersSocketId: ${sendersSocketId} targets: ${data.targetPhoneNumbers}`);
                data.targetUserIds.forEach(phoneNumber => {
                    const targetSocketId = this.userSocketMap[phoneNumber];
                    console.log(`Iterating ${targetSocketId}`);
                    if (targetSocketId) {
                        console.log(`Emitting meeting-id-offer`);
                        socket.to(targetSocketId).emit('meeting-id-offer', {
                            senderSocketId: socket.id,
                            sendPhoneNumber: data.userPhoneNumber,
                            meetingId: data.meetingId
                        });
                    }else{
                        console.log("Undefined, hence here!");
                        socket.emit('meeting-id-failed', { //we dont need to use .to here because we dont emit the event to the same sender by to, we can just use emit
                            sender: socket.id,
                            senderPhoneNumber: data.userPhoneNumber,
                            message: 'Failed! - no user found!'
                        });
                    }
                });
            });

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


