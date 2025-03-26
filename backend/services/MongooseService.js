const mongoose = require("mongoose");
const LoggerFactory = require("../factories/loggerFactory.js");
class MongooseService{
    constructor() {}    
    async connectToMongoDB(mongoDbUrl) {
        try {
            //connect to the database now
            await mongoose.connect(mongoDbUrl).then(() => LoggerFactory.getApplicationLogger.info('Connected to MongoDB'))
            .catch((err) => LoggerFactory.getApplicationLogger.error('MongoDB connection error:', err));
        }catch(exception) {
            LoggerFactory.getApplicationLogger.error(`Exception Occured ${exception}`);
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
        await session.startTransaction();
    }

    async abandonMongooseTransaction(session) {
        if (!session || session === undefined) {
            throw new Error(`${session} is Not a valid Mongoose Session...`);
        }
        await session.abortTransaction();
    }

    async commitMongooseTransaction(session) {
        if (!session || session === undefined) {
            throw new Error(`${session} is Not a valid Mongoose Session...`);
        }
        await session.commitTransaction();
    }

}

module.exports = MongooseService;