const AbstractService = require('./AbstractService')
class ReactionService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ReactionService;