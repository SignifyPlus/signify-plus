
class AbstractService {
    constructor(schemaModel) {
        this.schemaModel = schemaModel;
    }

    async getDocuments(session = null) {
        try{
            const document = session ? await this.schemaModel.find().session(session) : await this.schemaModel.find();
            return document;
        }catch(exception){
            throw new Error(`Error Fetching the Documents: ${exception.message}`);
        }
    }

    getDocumentsQuery(session = null) {
        try{
            const documents = session ? this.schemaModel.find().session(session) : this.schemaModel.find().session(session);
            return documents;
        }catch(exception){
            throw new Error(`Error Fetching the Documents: ${exception.message}`);
        }
    }

    async getDocumentsByCustomFilters(filterConditions, session = null) {
        try{
            return await this.schemaModel.find(filterConditions);
        }catch(exception){
            throw new Error(`Error Fetching the Documents: ${exception.message}`);
        }
    }

    async getDocumentById(objectId, session = null) {
        try{
            return await this.schemaModel.findById(objectId);
        }catch(exception){
            throw new Error(`Error Fetching the Document with Id: ${objectId}, ${exception.message}`);
        }
    }

    getDocumentsByCustomFiltersQuery(filterConditions, session = null) {
        try{
            return this.schemaModel.find(filterConditions);
        }catch(exception){
            throw new Error(`Error Fetching the Document: ${filterConditions}, ${exception.message}`);
        }
    }

    async getDocumentByCustomFilters(filterConditions, session = null) {
        try{
            const entity = await this.schemaModel.findOne(filterConditions);
            return entity;
        }catch(exception){
            throw new Error(`Error Retrieving the Documet: ${exception.message}`);
        }
    }

    async updateDocument(filterConditions, updateFields, session = null) {
        try{
            const entity = await this.schemaModel.findOneAndUpdate(filterConditions, updateFields, {new : true});
            return entity;
        }catch(exception){
            throw new Error(`Error Updating the Document: ${exception.message}`);
        }
    }

    async saveDocument(data, session = null) {
        try{
            const entity = session ? await this.schemaModel.create(data).session(session) : await this.schemaModel.create(data);
            return entity;
        }catch(exception){
            throw new Error(`Error Saving the Document: ${exception.message}`);
        }
    }

    async saveDocuments(data, session = null) {
        try{
            const entity = await this.schemaModel.insertMany(data);
            return entity;
        }catch(exception){
            throw new Error(`Error Saving the Documents: ${exception.message}`);
        }
    }

    async deleteDocument(filterConditions, session = null) {
        try{
            const entity = await this.schemaModel.findOneAndDelete(filterConditions, {new : true})
            return entity;
        }catch(exception) {
            throw new Error(`Error Deleting the Document: ${exception.message}`);
        }
    }

    
    async deleteDocuments(filterConditions, session = null) {
        try{
            const entity = await this.schemaModel.deleteMany(filterConditions)
            return entity;
        }catch(exception) {
            throw new Error(`Error Deleting the Documents: ${exception.message}`);
        }
    }

    async deleteDocumentById(objectId, session = null) {
        try{
            const entity = await this.schemaModel.findOneAndDelete({_id: objectId}, {new : true})
            return entity;
        }catch(exception) {
            throw new Error(`Error Deleting the Document: ${exception.message}`);
        }
    }
}

module.exports = AbstractService;
