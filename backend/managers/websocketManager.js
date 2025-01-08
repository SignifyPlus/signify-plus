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
            this.messageEvent(socket);
            this.socketRegistrationEvent(socket);
            this.meetingIdEvent(socket);
            this.meetingIdDeclineEvent(socket);
            this.offerEvent(socket);
            this.answerEvent(socket);
            this.disconnectEvent(socket);
        })
    }

    messageEvent(socket) {
        socket.on('message', (message) => {
            console.log(message);
            this.signifyPlusSocketIo.emit('message', `${socket.id} said ${message}}`)
        })
    }

    socketRegistrationEvent(socket) {
        socket.on('socket-registration', (data) => {
            //add userID and the socket id to the map
            this.userSocketMap[data.userPhoneNumber] = socket.id;
            console.log(`User ${data.userPhoneNumber} registered with socket ID: ${socket.id}`);
        })
    }

    meetingIdEvent(socket) {
        socket.on('meeting-id', (data) => {
            const sendersSocketId = this.userSocketMap[data.userPhoneNumber];
            if (!sendersSocketId) { //if sender is undefined, exit
                return;
            }
            console.log(`Meeting ID: ${data.meetingId} callerPhoneNumber: ${data.userPhoneNumber} sendersSocketId: ${sendersSocketId} targets: ${data.targetPhoneNumbers}`);
            data.targetPhoneNumbers.forEach(phoneNumber => {
                const targetSocketId = this.userSocketMap[phoneNumber];
                console.log(`Iterating ${targetSocketId}`);
                const event = targetSocketId? 'meeting-id-offer': 'meeting-id-failed';
                const socketEventType = targetSocketId? socket.to(targetSocketId) : socket;
                const payloadBody = targetSocketId? 
                {
                    senderSocketId: socket.id,
                    sendPhoneNumber: data.userPhoneNumber,
                    meetingId: data.meetingId
                } :
                {
                    sender: socket.id,
                    senderPhoneNumber: data.userPhoneNumber,
                    message: 'Failed! - no user found!'
                };
                socketEventType.emit(event, payloadBody);
            });
        });
    }

    meetingIdDeclineEvent(socket) {
        socket.on('meeting-id-decline', (data) => {
            console.log(`decline offer ${data.userPhoneNumber} ${data.meetingId} ${data.targetPhoneNumber}`)
            //send the decline offer to the targetPhoneNumber
            //find the user from the map
            const targetPhoneNumberSocketId = this.userSocketMap[data.targetPhoneNumber];

            const event = targetPhoneNumberSocketId? 'call-declined' : 'meeting-id-decline-failed';
            const socketEventType = targetPhoneNumberSocketId? socket.to(targetPhoneNumberSocketId) : socket;
            const payloadBody = targetPhoneNumberSocketId? 
            {
                sender: socket.id,
                declinedUsersPhoneNumber: data.userPhoneNumber,
                message: 'Call Declined!'
            } :
            { 
                sender: socket.id,
                senderPhoneNumber: data.userPhoneNumber,
                message: `Failed! - no user found with ${data.targetPhoneNumber}`
            };
            socketEventType.emit(event, payloadBody);
        });
    }

    offerEvent(socket) {
        socket.on('offer', (data) => {
            console.log(`Offer from ${socket.id} to ${data.target}`);
            socket.to(data.target).emit('offer', {
                sender: socket.id,
                offer: data.offer
            });
        });
    }

    answerEvent(socket) {
        socket.on('answer', (data) => {
            console.log(`Answer from ${socket.id} to ${data.target}`);
            socket.to(data.target).emit('answer', {
                sender: socket.id,
                answer: data.answer
            });
        });
    }

    disconnectEvent(socket) {
        socket.on('disconnect', () => {
            console.log(`Socket with id ${socket.id.substr(0,2)} disconnected`);
        });
    }
}

module.exports = WebSocketManager;


