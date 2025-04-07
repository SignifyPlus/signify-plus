/**
 * ServiceFactory takes on the responsibility of initializing and providing instances
 * of all database-esque services. Since these services are stateless, factory pattern
 * serves as a nuanced approach to mitigate the issue of creating redundant instances across different scripts.
 */

//services
const CallHistoryService = require('../services/CallHistoryService.js');
const ChannelService = require('../services/ChannelService.js');
const ChannelSubscriberService = require('../services/ChannelSubscriberService.js');
const ContactService = require('../services/ContactService.js');
const ForumMemberService = require('../services/ForumMemberService.js');
const ForumPermissionsService = require('../services/ForumPermissionsService.js');
const ForumService = require('../services/ForumService.js');
const ForumThreadService = require('../services/ForumThreadService.js');
const GroupMemberService = require('../services/GroupMemberService.js');
const GroupService = require('../services/GroupService.js');
const MediaService = require('../services/MediaService.js');
const MessageService = require('../services/MessageService.js');
const ChatService = require('../services/ChatService.js');
const NotificationService = require('../services/NotificationService.js');
const ReactionService = require('../services/ReactionService.js');
const ReportService = require('../services/ReportService.js');
const SettingsService = require('../services/SettingsService.js');
const ThreadCommentService = require('../services/ThreadCommentService.js');
const UserActivityService = require('../services/UserActivityService.js');
const UserService = require('../services/UserService.js');
const ThreadService = require('../services/ThreadService.js');
const CommentService = require('../services/CommentService.js');

//models
const CallHistory = require('../models/CallHistory.js');
const Channel = require('../models/Channel.js');
const ChannelSubscriber = require('../models/ChannelSubscriber.js');
const Contact = require('../models/Contact.js');
const Forum = require('../models/Forum.js');
const ForumMember = require('../models/ForumMember.js');
const ForumPermissions = require('../models/ForumPermissions.js');
const ForumThread = require('../models/ForumThread.js');
const Group = require('../models/Group.js');
const GroupMember = require('../models/GroupMember.js');
const Media = require('../models/Media.js');
const Message = require('../models/Message.js');
const Chat = require('../models//Chat.js');
const Notification = require('../models/Notification.js');
const Reaction = require('../models/Reaction.js');
const Report = require('../models/Report.js');
const Settings = require('../models/Settings.js');
const ThreadComment = require('../models/ThreadComment.js');
const User = require('../models/User.js');
const UserActivity = require('../models/UserActivity.js');
const Thread = require('../models/Thread.js');
const Comment = require('../models/Comment.js');
const MongooseService = require('../services/MongooseService.js');

class ServiceFactory {
   //private fields
   /**
    * @private
    * @type {CallHistoryService | null}
    */
   static #callHistoryService = null;

   /**
    * @private
    * @type {ChannelService | null}
    */
   static #channelService = null;

   /**
    * @private
    * @type {ChannelSubscriberService | null}
    */
   static #channelSubscriberService = null;

   /**
    * @private
    * @type {ContactService | null}
    */
   static #contactService = null;

   /**
    * @private
    * @type {ForumMemberService | null}
    */
   static #forumMemberService = null;

   /**
    * @private
    * @type {ForumPermissionsService | null}
    */
   static #forumPermissionsService = null;

   /**
    * @private
    * @type {ForumService | null}
    */
   static #forumService = null;

   /**
    * @private
    * @type {ForumThreadService | null}
    */
   static #forumThreadService = null;

   /**
    * @private
    * @type {GroupMemberService | null}
    */
   static #groupMemberService = null;

   /**
    * @private
    * @type {GroupService | null}
    */
   static #groupService = null;

   /**
    * @private
    * @type {MediaService | null}
    */
   static #mediaService = null;

   /**
    * @private
    * @type {MessageService | null}
    */
   static #messageService = null;

   /**
    * @private
    * @type {ChatService | null}
    */
   static #chatService = null;

   /**
    * @private
    * @type {NotificationService | null}
    */
   static #notificationService = null;

   /**
    * @private
    * @type {ReactionService | null}
    */
   static #reactionService = null;

   /**
    * @private
    * @type {ReportService | null}
    */
   static #reportService = null;

   /**
    * @private
    * @type {SettingsService | null}
    */
   static #settingsService = null;

   /**
    * @private
    * @type {ThreadCommentService | null}
    */
   static #threadCommentService = null;

   /**
    * @private
    * @type {ThreadService | null}
    */
   static #threadService = null;

   /**
    * @private
    * @type {CommentService | null}
    */
   static #commentService = null;

   /**
    * @private
    * @type {UserActivityService | null}
    */
   static #userActivityService = null;

   /**
    * @private
    * @type {UserService | null}
    */
   static #userService = null;

   /**
    * @private
    * @type {MongooseService | null}
    */
   static #mongooseService = null;

   constructor() {}

   static get getCallHistoryService() {
      if (!ServiceFactory.#callHistoryService) {
         ServiceFactory.#callHistoryService = new CallHistoryService(
            CallHistory,
         );
      }
      return ServiceFactory.#callHistoryService;
   }

   static get getChannelService() {
      if (!ServiceFactory.#channelService) {
         ServiceFactory.#channelService = new ChannelService(Channel);
      }
      return ServiceFactory.#channelService;
   }

   static get getChannelSubscriberService() {
      if (!ServiceFactory.#channelSubscriberService) {
         ServiceFactory.#channelSubscriberService =
            new ChannelSubscriberService(ChannelSubscriber);
      }
      return ServiceFactory.#channelSubscriberService;
   }

   static get getContactService() {
      if (!ServiceFactory.#contactService) {
         ServiceFactory.#contactService = new ContactService(Contact);
      }
      return ServiceFactory.#contactService;
   }

   static get getForumMemberService() {
      if (!ServiceFactory.#forumMemberService) {
         ServiceFactory.#forumMemberService = new ForumMemberService(
            ForumMember,
         );
      }
      return ServiceFactory.#forumMemberService;
   }

   static get getForumPermissionsService() {
      if (!ServiceFactory.#forumPermissionsService) {
         ServiceFactory.#forumPermissionsService = new ForumPermissionsService(
            ForumPermissions,
         );
      }
      return ServiceFactory.#forumPermissionsService;
   }

   static get getForumService() {
      if (!ServiceFactory.#forumService) {
         ServiceFactory.#forumService = new ForumService(Forum);
      }
      return ServiceFactory.#forumService;
   }

   static get getForumThreadService() {
      if (!ServiceFactory.#forumThreadService) {
         ServiceFactory.#forumThreadService = new ForumThreadService(
            ForumThread,
         );
      }
      return ServiceFactory.#forumThreadService;
   }

   static get getThreadService() {
      if (!ServiceFactory.#threadService) {
         ServiceFactory.#threadService = new ThreadService(Thread);
      }
      return ServiceFactory.#threadService;
   }

   static get getCommentService() {
      if (!ServiceFactory.#commentService) {
         ServiceFactory.#commentService = new CommentService(Comment);
      }
      return ServiceFactory.#commentService;
   }

   static get getGroupMemberService() {
      if (!ServiceFactory.#groupMemberService) {
         ServiceFactory.#groupMemberService = new GroupMemberService(
            GroupMember,
         );
      }
      return ServiceFactory.#groupMemberService;
   }

   static get getGroupService() {
      if (!ServiceFactory.#groupService) {
         ServiceFactory.#groupService = new GroupService(Group);
      }
      return ServiceFactory.#groupService;
   }

   static get getMediaService() {
      if (!ServiceFactory.#mediaService) {
         ServiceFactory.#mediaService = new MediaService(Media);
      }
      return ServiceFactory.#mediaService;
   }

   static get getMessageService() {
      if (!ServiceFactory.#messageService) {
         ServiceFactory.#messageService = new MessageService(Message);
      }
      return ServiceFactory.#messageService;
   }

   static get getChatService() {
      if (!ServiceFactory.#chatService) {
         ServiceFactory.#chatService = new ChatService(Chat);
      }
      return ServiceFactory.#chatService;
   }

   static get getNotificationService() {
      if (!ServiceFactory.#notificationService) {
         ServiceFactory.#notificationService = new NotificationService(
            Notification,
         );
      }
      return ServiceFactory.#notificationService;
   }

   static get getReactionService() {
      if (!ServiceFactory.#reactionService) {
         ServiceFactory.#reactionService = new ReactionService(Reaction);
      }
      return ServiceFactory.#reactionService;
   }

   static get getReportService() {
      if (!ServiceFactory.#reportService) {
         ServiceFactory.#reportService = new ReportService(Report);
      }
      return ServiceFactory.#reportService;
   }

   static get getSettingsService() {
      if (!ServiceFactory.#settingsService) {
         ServiceFactory.#settingsService = new SettingsService(Settings);
      }
      return ServiceFactory.#settingsService;
   }

   static get getThreadCommentService() {
      if (!ServiceFactory.#threadCommentService) {
         ServiceFactory.#threadCommentService = new ThreadCommentService(
            ThreadComment,
         );
      }
      return ServiceFactory.#threadCommentService;
   }

   static get getUserActivityService() {
      if (!ServiceFactory.#userActivityService) {
         ServiceFactory.#userActivityService = new UserActivityService(
            UserActivity,
         );
      }
      return ServiceFactory.#userActivityService;
   }

   static get getUserService() {
      if (!ServiceFactory.#userService) {
         ServiceFactory.#userService = new UserService(User);
      }
      return ServiceFactory.#userService;
   }

   static get getMongooseService() {
      if (!ServiceFactory.#mongooseService) {
         ServiceFactory.#mongooseService = new MongooseService();
      }
      return ServiceFactory.#mongooseService;
   }
}

module.exports = ServiceFactory;
