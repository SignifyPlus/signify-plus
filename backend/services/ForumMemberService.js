const AbstractService = require('./AbstractService')
class ForumMemberService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ForumMemberService;