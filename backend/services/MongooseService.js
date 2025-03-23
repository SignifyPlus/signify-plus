const mongoose = require("mongoose");
class MongooseService{
    constructor() {}    
    async connectToMongoDB(mongoDbUrl) {
        try {
            //connect to the database now
            await mongoose.connect(mongoDbUrl).then(() => console.log('Connected to MongoDB'))
            .catch((err) => console.error('MongoDB connection error:', err));
        }catch(exception) {
            console.log(`Exception Occured ${exception}`);
            throw new Error(exception);
        }
    }

    async getMoongooseSession() {
        return await mongoose.startSession();
    }

    async startMongooseTransaction(session) {
        if (!session || session === undefined) {
            throw new Error(`${session} is Not a valid Mongoose Session...`);
        }
        session.startTransaction();
    }

    async abandonMongooseTransaction(session) {
        if (!session || session === undefined) {
            throw new Error(`${session} is Not a valid Mongoose Session...`);
        }
        session.abortTransaction();
    }
}

module.exports = MongooseService;