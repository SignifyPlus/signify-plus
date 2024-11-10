const AbstractService = require('./AbstractService')
class ForumUserService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ForumUserService;