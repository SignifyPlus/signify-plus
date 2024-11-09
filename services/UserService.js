const AbstractService = require('./AbstractService')
class UserService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = UserService;