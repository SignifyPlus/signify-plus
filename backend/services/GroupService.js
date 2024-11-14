const AbstractService = require('./AbstractService')
class GroupService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = GroupService;