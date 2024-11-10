const AbstractService = require('./AbstractService')
class MessageService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
    //specific queries will go here
}

module.exports = MessageService;