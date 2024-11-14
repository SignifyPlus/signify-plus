const AbstractService = require('./AbstractService')
class ForumService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ForumService;