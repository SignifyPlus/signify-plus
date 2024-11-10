const AbstractService = require('./AbstractService')
class ForumUserService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }

    async saveData(data) {
    }

    async deleteData(data) {
    }
}

module.exports = ForumUserService;