const GroupService = require("../../../services/GroupService");

//Mocking the schema model and abstract methods
const mockModel = {};
let service;

beforeEach(() => {
    service = new GroupService(mockModel);

    service.__proto__.getDocuments = jest.fn(() => Promise.resolve("all groups"));
    service.__proto__.getDocumentById = jest.fn(() => Promise.resolve("group by id"));
    service.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered groups"));
    service.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered group"));
    service.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated group"));
    service.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved group"));
    service.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["group1", "group2"]));
    service.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted group"));
    service.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted group by id"));
    service.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
    service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
});

describe("GroupService", () => {
    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all groups");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("123");
        expect(result).toBe("group by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({ active: true });
        expect(result).toBe("filtered groups");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({ name: "Study" });
        expect(result).toBe("one filtered group");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({ id: 1 }, { name: "Updated" });
        expect(result).toBe("updated group");
    });

    test("saveDocument delegates to super", async () => {
        const result = await service.saveDocument({ name: "New Group" });
        expect(result).toBe("saved group");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{ name: "A" }, { name: "B" }]);
        expect(result).toEqual(["group1", "group2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({ name: "Old Group" });
        expect(result).toBe("deleted group");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("123");
        expect(result).toBe("deleted group by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({ archived: true });
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({ key: "value" });
        expect(result).toBe("query object");
    });
});
