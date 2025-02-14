class MeetingSocket {
    constructor(socket) {
        this.userSocketMap = {};
        this.meetingIdEvent(socket);
        this.meetingIdDeclineEvent(socket);
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
                    senderPhoneNumber: data.userPhoneNumber,
                    meetingId: data.meetingId
                } :
                {
                    senderSocketId: socket.id,
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
}