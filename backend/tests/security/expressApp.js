//created for testing purposes, server.js is too heavy to load for tests
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const userRoutes = require('../../routes/UserRoutes');
const homeRoutes = require('../../routes/HomeRoute');
const contactRoutes = require('../../routes/ContactRoutes');
const chatRoutes = require('../../routes/ChatRoutes');
const messageRoutes = require('../../routes/MessageRoutes');
const forumRoutes = require('../../routes/ForumRoutes');
const forumMemberRoutes = require('../../routes/ForumMemberRoutes');
const threadRoutes = require('../../routes/ThreadRoutes');
const commentRoutes = require('../../routes/CommentRoutes');
const settingsRoutes = require('../../routes/SettingsRoutes');

const UserModel = require('../../models/User');
const Encrypt = require('../../utilities/encrypt');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

beforeEach(async () => {
    const hashedPassword = await Encrypt.encrypt(10, "1111");

    await UserModel.create({
        name: "Test User",
        phoneNumber: "+90123456",
        password: hashedPassword
    });
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.use('/users', userRoutes);
app.use('/', homeRoutes);
app.use('/contacts', contactRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);
app.use('/forums', forumRoutes);
app.use('/forumMembers', forumMemberRoutes);
app.use('/threads', threadRoutes);
app.use('/comments', commentRoutes);
app.use('/settings', settingsRoutes);

module.exports = app;