const AbstractService = require('./AbstractService')
class ChannelSubscriberService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ChannelSubscriberService;