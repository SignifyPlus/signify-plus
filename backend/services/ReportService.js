const AbstractService = require('./AbstractService')
class ReportService extends AbstractService {
    constructor(model) {
        this.model = model;
    }
    async getData() {
    }
}

module.exports = ReportService;