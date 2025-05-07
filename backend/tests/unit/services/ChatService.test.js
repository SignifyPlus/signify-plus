const ChatService = require("../../../services/ChatService");
const AbstractService = require("../../../services/AbstractService");
const SignifyException = require("../../../exception/SignifyException");
const EventDispatcher = require("../../../events/eventDispatcher");
const EventConstants = require("../../../constants/eventConstants");

jest.mock("../../../events/eventDispatcher");

describe("ChatService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ChatService(mockModel);
        jest.clearAllMocks();

        jest.spyOn(AbstractService.prototype, 'getDocuments').mockResolvedValue("all chats");
        jest.spyOn(AbstractService.prototype, 'getDocumentById').mockResolvedValue("chat by id");
        jest.spyOn(AbstractService.prototype, 'getDocumentsByCustomFilters').mockResolvedValue("filtered chats");
        jest.spyOn(AbstractService.prototype, 'getDocumentByCustomFilters').mockResolvedValue("one filtered chat");
        jest.spyOn(AbstractService.prototype, 'updateDocument').mockResolvedValue("updated chat");
        jest.spyOn(AbstractService.prototype, 'saveDocuments').mockResolvedValue(["chat1", "chat2"]);
        jest.spyOn(AbstractService.prototype, 'deleteDocument').mockResolvedValue("deleted chat");
        jest.spyOn(AbstractService.prototype, 'deleteDocumentById').mockResolvedValue("deleted chat by id");
        jest.spyOn(AbstractService.prototype, 'deleteDocuments').mockResolvedValue("bulk deleted");
        jest.spyOn(AbstractService.prototype, 'getDocumentsByCustomFiltersQuery').mockReturnValue("query object");
        jest.spyOn(AbstractService.prototype, 'getDocumentsQuery').mockReturnValue("base query");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all chats");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("abc");
        expect(result).toBe("chat by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({ a: 1 });
        expect(result).toBe("filtered chats");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({ a: 1 });
        expect(result).toBe("one filtered chat");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({ a: 1 }, { b: 2 });
        expect(result).toBe("updated chat");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{ msg: "a" }]);
        expect(result).toEqual(["chat1", "chat2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({ a: 1 });
        expect(result).toBe("deleted chat");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("chat-id");
        expect(result).toBe("deleted chat by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({ group: "general" });
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({ group: "a" });
        expect(result).toBe("query object");
    });

    test("getDocumentsQuery delegates to super", () => {
        const result = service.getDocumentsQuery();
        expect(result).toBe("base query");
    });

    test("saveDocument dispatches chat event and returns saved chat", async () => {
        const data = { message: "Hello!" };
        const savedChat = { _id: "123", ...data };

        jest.spyOn(AbstractService.prototype, 'saveDocument').mockResolvedValue(savedChat);
        EventDispatcher.dispatchEvent.mockResolvedValue(true);

        const result = await service.saveDocument(data);

        expect(result).toBe(savedChat);
        expect(AbstractService.prototype.saveDocument).toHaveBeenCalledWith(data, null);
        expect(EventDispatcher.dispatchEvent).toHaveBeenCalledWith(EventConstants.CHAT_CREATED_EVENT, data);
    });

    test("saveDocument returns SignifyException when saving fails", async () => {
        jest.spyOn(AbstractService.prototype, 'saveDocument').mockResolvedValue(null);

        const result = await service.saveDocument({ text: "Test chat" });

        expect(result).toBeInstanceOf(SignifyException);
        expect(result.status).toBe(400);
        expect(result.message).toContain("Couldn't save chat");
        expect(EventDispatcher.dispatchEvent).not.toHaveBeenCalled();
    });
});