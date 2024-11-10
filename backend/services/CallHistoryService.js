const AbstractService = require('./AbstractService')
class CallHistoryService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = CallHistoryService;