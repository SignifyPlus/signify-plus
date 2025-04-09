class AbstractService {
   constructor(schemaModel) {
      this.schemaModel = schemaModel;
   }

   //you can't use .session() with create, update and delete as they dont return an immediate result like queries, or get functions
   //so pass session like this with filters and data -> {session} for create, update and delete
   async getDocuments(session = null) {
      try {
         const document = session
            ? await this.schemaModel.find().session(session)
            : await this.schemaModel.find();
         return document;
      } catch (exception) {
         throw new Error(`Error Fetching the Documents: ${exception.message}`);
      }
   }

   getDocumentsQuery(session = null) {
      try {
         const documentsQuery = session
            ? this.schemaModel.find().session(session)
            : this.schemaModel.find();
         return documentsQuery;
      } catch (exception) {
         throw new Error(`Error Fetching the Documents: ${exception.message}`);
      }
   }

   async getDocumentsByCustomFilters(filterConditions, session = null) {
      try {
         const documents = session
            ? await this.schemaModel.find(filterConditions).session(session)
            : await this.schemaModel.find(filterConditions);
         return documents;
      } catch (exception) {
         throw new Error(`Error Fetching the Documents: ${exception.message}`);
      }
   }

   async getDocumentById(objectId, session = null) {
      try {
         const document = session
            ? await this.schemaModel.findById(objectId).session(session)
            : await this.schemaModel.findById(objectId);
         return document;
      } catch (exception) {
         throw new Error(
            `Error Fetching the Document with Id: ${objectId}, ${exception.message}`,
         );
      }
   }

   getDocumentsByCustomFiltersQuery(filterConditions, session = null) {
      try {
         const documentsQuery = session
            ? this.schemaModel.find(filterConditions).session(session)
            : this.schemaModel.find(filterConditions);
         return documentsQuery;
      } catch (exception) {
         throw new Error(
            `Error Fetching the Document: ${filterConditions}, ${exception.message}`,
         );
      }
   }

   async getDocumentByCustomFilters(filterConditions, session = null) {
      try {
         const document = session
            ? await this.schemaModel.findOne(filterConditions).session(session)
            : await this.schemaModel.findOne(filterConditions);
         return document;
      } catch (exception) {
         throw new Error(`Error Retrieving the Document: ${exception.message}`);
      }
   }

   async updateDocument(filterConditions, updateFields, session = null) {
      try {
         const document = session
            ? await this.schemaModel.findOneAndUpdate(
                 filterConditions,
                 updateFields,
                 { new: true, session },
              )
            : await this.schemaModel.findOneAndUpdate(
                 filterConditions,
                 updateFields,
                 { new: true },
              );
         return document;
      } catch (exception) {
         throw new Error(`Error Updating the Document: ${exception.message}`);
      }
   }

   async saveDocument(data, session = null) {
      try {
         data = Array.isArray(data) ? data : [data];
         const entity = session
            ? await this.schemaModel.create(data, { session })
            : await this.schemaModel.create(data);
         return entity;
      } catch (exception) {
         throw new Error(`Error Saving the Document: ${exception.message}`);
      }
   }

   async saveDocuments(data, session = null) {
      try {
         const documents = session
            ? await this.schemaModel.insertMany(data, { session })
            : await this.schemaModel.insertMany(data);
         return documents;
      } catch (exception) {
         throw new Error(`Error Saving the Documents: ${exception.message}`);
      }
   }

   async deleteDocument(filterConditions, session = null) {
      try {
         const document = session
            ? await this.schemaModel.findOneAndDelete(filterConditions, {
                 new: true,
                 session,
              })
            : await this.schemaModel.findOneAndDelete(filterConditions, {
                 new: true,
              });
         return document;
      } catch (exception) {
         throw new Error(`Error Deleting the Document: ${exception.message}`);
      }
   }

   async deleteDocuments(filterConditions, session = null) {
      try {
         const documents = session
            ? await this.schemaModel.deleteMany(filterConditions, { session })
            : await this.schemaModel.deleteMany(filterConditions);
         return documents;
      } catch (exception) {
         throw new Error(`Error Deleting the Documents: ${exception.message}`);
      }
   }

   async deleteDocumentById(objectId, session = null) {
      try {
         const document = session
            ? await this.schemaModel.findOneAndDelete(
                 { _id: objectId },
                 { new: true, session },
              )
            : await this.schemaModel.findOneAndDelete(
                 { _id: objectId },
                 { new: true },
              );
         return document;
      } catch (exception) {
         throw new Error(`Error Deleting the Document: ${exception.message}`);
      }
   }
}

module.exports = AbstractService;
