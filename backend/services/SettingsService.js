const AbstractService = require('./AbstractService')
class SettingsService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = SettingsService;