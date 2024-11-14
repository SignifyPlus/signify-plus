const AbstractService = require('./AbstractService')
class ForumPermissionsService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ForumPermissionsService;