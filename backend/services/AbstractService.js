const mongoose = require('mongoose');

class AbstractService {
    constructor(schemaModel) {
        this.schemaModel = schemaModel;
    }

    async getData() {
        try{
            return await this.schemaModel.find();
        }catch(exception){
            throw new Error(`Error Fetching the Documents: ${exception.message}`);
        }
    }

    async updateData(filterConditions, updateFields) {
        try{
            const entity = await this.schemaModel.findOneAndUpdate(filterConditions, updateFields, {new : true});
            console.log(`Updated Entity: ${entity}`)
        }catch(exception){
            throw new Error(`Error Updating the Document: ${exception.message}`);
        }
    }

    async saveData(data) {
        try{
            const entity = await this.schemaModel.create(data);
            console.log(`Saved Entity: ${entity}`)
        }catch(exception){
            throw new Error(`Error Saving the Document: ${exception.message}`);
        }
    }

    async deleteData(filterConditions) {
        try{
            const entity = await this.schemaModel.findOneAndDelete(filterConditions, {new : true})
            console.log(`Deleted Entity: ${entity}`)
        }catch(exception) {
            throw new Error(`Error Deleting the Document: ${exception.message}`);
        }
    }
}
module.exports = AbstractService;
