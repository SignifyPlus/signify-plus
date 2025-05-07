const express = require('express')
const mongoose = require('mongoose')
const ServiceFactory = require('../../factories/serviceFactory')

const userRoutes = require('../../routes/UserRoutes')
const homeRoutes = require('../../routes/HomeRoute')
const contactRoutes = require('../../routes/ContactRoutes')
const chatRoutes = require('../../routes/ChatRoutes')
const messageRoutes = require('../../routes/MessageRoutes')
const forumRoutes = require('../../routes/ForumRoutes')
const forumMemberRoutes = require('../../routes/ForumMemberRoutes')
const threadRoutes = require('../../routes/ThreadRoutes')
const commentRoutes = require('../../routes/CommentRoutes')
const settingsRoutes = require('../../routes/SettingsRoutes')
const forumPermissionsRoutes  = require('../../routes/ForumPermissionsRoutes')
const forumThreadsRoutes = require('../../routes/ForumThreadRoutes')
const groupsRoutes = require('../../routes/GroupRoutes')
const groupMembersRoutes = require('../../routes/GroupMemberRoutes')
const mediaRoutes = require('../../routes/MediaRoutes')
const jwtRoutes = require('../../routes/JwtRoutes')
const notificationsRoutes = require('../../routes/NotificationRoutes')
const reactionsRoutes = require('../../routes/ReactionRoutes')
const reportsRoutes = require('../../routes/ReportRoutes')
const threadCommentsRoutes = require('../../routes/ThreadCommentRoutes')
const userActivitiesRoutes = require('../../routes/UserActivityRoutes')

const app = express()
app.disable('x-powered-by')
app.use(express.json())

app.use('/users', userRoutes)
app.use('/', homeRoutes)
app.use('/contacts', contactRoutes)
app.use('/chats', chatRoutes)
app.use('/messages', messageRoutes)
app.use('/forums', forumRoutes)
app.use('/forumMembers', forumMemberRoutes)
app.use('/threads', threadRoutes)
app.use('/comments', commentRoutes)
app.use('/settings', settingsRoutes)
app.use('/forumPermissions', forumPermissionsRoutes)
app.use('/forumThreads', forumThreadsRoutes)
app.use('/groups', groupsRoutes)
app.use('/groupMembers', groupMembersRoutes)
app.use('/media', mediaRoutes)
app.use('/jwt', jwtRoutes)
app.use('/notifications', notificationsRoutes)
app.use('/reactions', reactionsRoutes)
app.use('/reports', reportsRoutes)
app.use('/threadComments', threadCommentsRoutes)
app.use('/userActivities', userActivitiesRoutes)

const TEST_DB_URI =
  process.env.MONGO_DB_TEST ||
  'mongodb://localhost:27017/signify_plus_test';

beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);

    app.locals.getUserService        = ServiceFactory.getUserService;
    app.locals.getForumService       = ServiceFactory.getForumService;
    app.locals.getForumMemberService = ServiceFactory.getForumMemberService;
});

afterAll(async () => {
    await mongoose.disconnect();
});

module.exports = app;