const AbstractService = require('./AbstractService')
class MediaService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = MediaService;