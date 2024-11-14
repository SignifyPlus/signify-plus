const AbstractService = require('./AbstractService')
class NotificationService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = NotificationService;