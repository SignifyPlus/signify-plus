const AbstractService = require('./AbstractService')
class ContactService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ContactService;