const AbstractService = require('./AbstractService')
class ChannelService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ChannelService;