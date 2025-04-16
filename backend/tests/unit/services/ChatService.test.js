const ChatService = require("../../../services/ChatService");
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
        jest.clearAllMocks(); //clear mocks to ensure no previous call affects tests

        //mocking AbstractService inherited methods
        service.__proto__.getDocuments = jest.fn(() => Promise.resolve("all chats"));
        service.__proto__.getDocumentById = jest.fn(() => Promise.resolve("chat by id"));
        service.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered chats"));
        service.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered chat"));
        service.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated chat"));
        service.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["chat1", "chat2"]));
        service.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted chat"));
        service.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted chat by id"));
        service.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
        service.__proto__.getDocumentsQuery = jest.fn(() => "base query");
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

        // mock only the super.saveDocument call
        service.__proto__.__proto__.saveDocument = jest.fn(() => Promise.resolve(savedChat));
        EventDispatcher.dispatchEvent.mockResolvedValue(true);

        const result = await service.saveDocument(data);

        expect(result).toBe(savedChat);
        expect(service.__proto__.__proto__.saveDocument).toHaveBeenCalledWith(data, null);
        expect(EventDispatcher.dispatchEvent).toHaveBeenCalledWith(EventConstants.CHAT_CREATED_EVENT, data);
    });

    test("saveDocument returns SignifyException when saving fails", async () => {
        // mock only the super.saveDocument call to simulate failure
        service.__proto__.__proto__.saveDocument = jest.fn(() => Promise.resolve(undefined));

        const result = await service.saveDocument({ text: "Test chat" });

        expect(result).toBeInstanceOf(SignifyException);
        expect(result.status).toBe(400);
        expect(result.message).toContain("Couldn't save chat");
        expect(EventDispatcher.dispatchEvent).not.toHaveBeenCalled();
    });
});