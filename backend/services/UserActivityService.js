const AbstractService = require('./AbstractService')
class UserActivityService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = UserActivityService;