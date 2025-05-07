const ContactService = require("../../../services/ContactService");

describe("ContactService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ContactService(mockModel);
        jest.clearAllMocks();

        service.__proto__.__proto__.getDocuments = jest.fn(() => Promise.resolve("all contacts"));
        service.__proto__.__proto__.getDocumentById = jest.fn(() => Promise.resolve("contact by id"));
        service.__proto__.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered contacts"));
        service.__proto__.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered contact"));
        service.__proto__.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated contact"));
        service.__proto__.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved contact"));
        service.__proto__.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["contact1", "contact2"]));
        service.__proto__.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted contact"));
        service.__proto__.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all contacts");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("id123");
        expect(result).toBe("contact by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({ active: true });
        expect(result).toBe("filtered contacts");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({ email: "test@example.com" });
        expect(result).toBe("one filtered contact");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({ id: "1" }, { name: "Updated" });
        expect(result).toBe("updated contact");
    });

    test("saveDocument delegates to super", async () => {
        const result = await service.saveDocument({ name: "New Contact" });
        expect(result).toBe("saved contact");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{ name: "One" }, { name: "Two" }]);
        expect(result).toEqual(["contact1", "contact2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({ id: "1" });
        expect(result).toBe("deleted contact");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("id123");
        expect(result).toBe("deleted by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({ status: "inactive" });
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({ name: "John" });
        expect(result).toBe("query object");
    });
});
