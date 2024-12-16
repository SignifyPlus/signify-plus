
class AbstractService {
    constructor(schemaModel) {
        this.schemaModel = schemaModel;
        console.log(this.schemaModel)
    }

    async getDocument() {
        try{
            return await this.schemaModel.find();
        }catch(exception){
            throw new Error(`Error Fetching the Documents: ${exception.message}`);
        }
    }

    async getDocumentById(objectId) {
        try{
            return await this.schemaModel.findById(objectId);
        }catch(exception){
            throw new Error(`Error Fetching the Document with Id: ${objectId}, ${exception.message}`);
        }
    }

    async updateDocument(filterConditions, updateFields) {
        try{
            const entity = await this.schemaModel.findOneAndUpdate(filterConditions, updateFields, {new : true});
            return entity;
        }catch(exception){
            throw new Error(`Error Updating the Document: ${exception.message}`);
        }
    }

    async saveDocument(data) {
        try{
            const entity = await this.schemaModel.create(data);
            return entity;
        }catch(exception){
            throw new Error(`Error Saving the Document: ${exception.message}`);
        }
    }

    async deleteDocument(filterConditions) {
        try{
            const entity = await this.schemaModel.findOneAndDelete(filterConditions, {new : true})
            return entity;
        }catch(exception) {
            throw new Error(`Error Deleting the Document: ${exception.message}`);
        }
    }

    async deleteDocumentById(objectId) {
        try{
            const entity = await this.schemaModel.findOneAndDelete({_id: objectId}, {new : true})
            return entity;
        }catch(exception) {
            throw new Error(`Error Deleting the Document: ${exception.message}`);
        }
    }
}

module.exports = AbstractService;
