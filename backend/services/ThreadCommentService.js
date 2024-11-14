const AbstractService = require('./AbstractService')
class ThreadCommentService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ThreadCommentService;