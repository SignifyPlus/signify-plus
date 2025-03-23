
/**
 * ServiceFactory takes on the responsibility of initializing and providing instances 
 * of all database-esque services. Since these services are stateless, factory pattern
 * serves as a nuanced approach to mitigate the issue of creating redundant instances across different scripts. 
 */

//services
const CallHistoryService = require("../services/CallHistoryService.js");
const ChannelService = require("../services/ChannelService.js");
const ChannelSubscriberService = require("../services/ChannelSubscriberService.js");
const ContactService = require("../services/ContactService.js");
const ForumMemberService = require("../services/ForumMemberService.js");
const ForumPermissionsService = require("../services/ForumPermissionsService.js");
const ForumService = require("../services/ForumService.js");
const ForumThreadService = require("../services/ForumThreadService.js");
const GroupMemberService = require("../services/GroupMemberService.js");
const GroupService = require("../services/GroupService.js");
const MediaService = require("../services/MediaService.js");
const MessageService = require("../services/MessageService.js");
const ChatService = require("../services/ChatService.js");
const NotificationService = require("../services/NotificationService.js");
const ReactionService = require("../services/ReactionService.js");
const ReportService = require("../services/ReportService.js");
const SettingsService = require("../services/SettingsService.js");
const ThreadCommentService = require("../services/ThreadCommentService.js");
const UserActivityService = require("../services/UserActivityService.js");
const UserService = require("../services/UserService.js");


//models
const CallHistory = require("../models/CallHistory.js");
const Channel = require("../models/Channel.js");
const ChannelSubscriber = require("../models/ChannelSubscriber.js");
const Contact = require("../models/Contact.js");
const Forum = require("../models/Forum.js");
const ForumMember = require("../models/ForumMember.js");
const ForumPermissions = require("../models/ForumPermissions.js");
const ForumThread = require("../models/ForumThread.js");
const Group = require("../models/Group.js");
const GroupMember = require("../models/GroupMember.js");
const Media = require("../models/Media.js");
const Message = require("../models/Message.js");
const Chat = require("../models//Chat.js");
const Notification = require("../models/Notification.js");
const Reaction = require("../models/Reaction.js");
const Report = require("../models/Report.js");
const Settings = require("../models/Settings.js");
const ThreadComment = require("../models/ThreadComment.js");
const User = require("../models/User.js");
const UserActivity = require("../models/UserActivity.js");
const MongooseService = require("../services/mongooseService.js");

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

    constructor() {
    }

    static get getCallHistoryService() {
        if (!this.#callHistoryService) {
            this.#callHistoryService = new CallHistoryService(CallHistory);
        }
        return this.#callHistoryService;
    }

    static get getChannelService() {
        if (!this.#channelService) {
            this.#channelService = new ChannelService(Channel);
        }
        return this.#channelService;
    }

    static get getChannelSubscriberService() {
        if (!this.#channelSubscriberService) {
            this.#channelSubscriberService = new ChannelSubscriberService(ChannelSubscriber);
        }
        return this.#channelSubscriberService;
    }

    static get getContactService() {
        if (!this.#contactService) {
            this.#contactService = new ContactService(Contact);
        }
        return this.#contactService;
    }

    static get getForumMemberService() {
        if (!this.#forumMemberService) {
            this.#forumMemberService = new ForumMemberService(ForumMember);
        }
        return this.#forumMemberService;
    }

    static get getForumPermissionsService() {
        if (!this.#forumPermissionsService) {
            this.#forumPermissionsService = new ForumPermissionsService(ForumPermissions);
        }
        return this.#forumPermissionsService;
    }

    static get getForumService() {
        if (!this.#forumService) {
            this.#forumService = new ForumService(Forum);
        }
        return this.#forumService;
    }

    static get getForumThreadService() {
        if (!this.#forumThreadService) {
            this.#forumThreadService = new ForumThreadService(ForumThread);
        }
        return this.#forumThreadService;
    }

    static get getGroupMemberService() {
        if (!this.#groupMemberService) {
            this.#groupMemberService = new GroupMemberService(GroupMember);
        }
        return this.#groupMemberService;
    }

    static get getGroupService() {
        if (!this.#groupService) {
            this.#groupService = new GroupService(Group);
        }
        return this.#groupService;
    }

    static get getMediaService() {
        if (!this.#mediaService) {
            this.#mediaService = new MediaService(Media);
        }
        return this.#mediaService;
    }

    static get getMessageService() {
        if (!this.#messageService) {
            this.#messageService = new MessageService(Message);
        }
        return this.#messageService;
    }

    static get getChatService() {
        if (!this.#chatService) {
            this.#chatService = new ChatService(Chat);
        }
        return this.#chatService;
    }

    static get getNotificationService() {
        if (!this.#notificationService) {
            this.#notificationService = new NotificationService(Notification);
        }
        return this.#notificationService;
    }

    static get getReactionService() {
        if (!this.#reactionService) {
            this.#reactionService = new ReactionService(Reaction);
        }
        return this.#reactionService;
    }

    static get getReportService() {
        if (!this.#reportService) {
            this.#reportService = new ReportService(Report);
        }
        return this.#reportService;
    }

    static get getSettingsService() {
        if (!this.#settingsService) {
            this.#settingsService = new SettingsService(Settings);
        }
        return this.#settingsService;
    }

    static get getThreadCommentService() {
        if (!this.#threadCommentService) {
            this.#threadCommentService = new ThreadCommentService(ThreadComment);
        }
        return this.#threadCommentService;
    }

    static get getUserActivityService() {
        if (!this.#userActivityService) {
            this.#userActivityService = new UserActivityService(UserActivity);
        }
        return this.#userActivityService;
    }

    static get getUserService() {
        if (!this.#userService) {
            this.#userService = new UserService(User);
        }
        return this.#userService;
    }

    static get getMongooseService() {
        if (!this.#mongooseService) {
            this.#mongooseService = new MongooseService()
        }
        return this.#mongooseService;
    }
}

module.exports = ServiceFactory;