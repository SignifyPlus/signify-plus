const AbstractService = require('./AbstractService')
class ForumPermissionsService extends AbstractService {
    constructor(schemaModel) {
        super(schemaModel);
    }
    async getData() {
        super.getData();
    }

    async updateData(schemaModel, filterConditions, updateFields) {
        super.updateData(schemaModel, filterConditions, updateFields);
    }

    async saveData(schemaModel,data) {
        super.saveData(schemaModel, data);
    }

    async deleteData(schemaModel, filterConditions) {
        super.saveData(schemaModel, filterConditions);
    }
}

module.exports = ForumPermissionsService;