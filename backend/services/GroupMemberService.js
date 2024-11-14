const AbstractService = require('./AbstractService')
class GroupMemberService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = GroupMemberService;