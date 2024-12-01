const axios = require('axios');

class MachineLearningTranslationManager {
    constructor(signifyPlusSocketIo) {
        this.signifyPlusSocketIo = signifyPlusSocketIo;
        this.setupMachineLearningSocketEvents();
    }

    setupMachineLearningSocketEvents() {
       this.signifyPlusSocketIo.on('send-frame', async (frame) => {
            console.log(`Frame Received: `, frame);
            try {
                const machineLearningResponse = await this.postFrameToMLEndpoint(frame);
                this.signifyPlusSocketIo.emit('ml-result', machineLearningResponse);
            } catch (exception) {
                console.error('Error processing frame:', exception);
                this.signifyPlusSocketIo.emit('ml-error', { message: 'Failed to process frame' });
            }
       });
    }

    async postFrameToMLEndpoint(frame) {
        try {
            const machineLearningEndpoint = ''; //fetch from env variable/or constants
            const machineLearningResponse = await axios.post(machineLearningEndpoint, frame);
            return machineLearningResponse.data;
        } catch (exception) {
            console.error('Error processing to ML endpoint:', exception);
            throw new Error("ASL Translation Failed");
        }
    }
}

module.exports = MachineLearningTranslationManager;


