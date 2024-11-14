const AbstractService = require('./AbstractService')
class ForumThreadService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ForumThreadService;