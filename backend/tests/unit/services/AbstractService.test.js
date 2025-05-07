const AbstractService = require("../../../services/AbstractService");
const mongoose = require("mongoose");

describe("AbstractService", () => {
    let fakeModel;
    let service;

    beforeEach(() => {
        fakeModel = {
            find: jest.fn(() => ({
                session: jest.fn().mockResolvedValue("docs with session"),
                then: function (resolve) {
                    return Promise.resolve("docs without session").then(resolve);
                },
            })),
    
            findById: jest.fn(() => ({
                session: jest.fn().mockResolvedValue("doc found by id with session"),
                then: function (resolve) {
                    return Promise.resolve("doc found by id without session").then(resolve);
                },
            })),
    
            findOne: jest.fn(() => ({
                session: jest.fn().mockResolvedValue("one doc with session"),
                then: function (resolve) {
                    return Promise.resolve("one doc without session").then(resolve);
                },
            })),
    
            findOneAndUpdate: jest.fn((filters, update, options) => {
                if (options && options.session) {
                    return Promise.resolve("updated doc with session");
                }
                return Promise.resolve("updated doc without session");
            }),
    
            create: jest.fn(() => Promise.resolve("created doc")),
    
            insertMany: jest.fn(() => Promise.resolve(["doc1", "doc2"])),
    
            findOneAndDelete: jest.fn((filters, options) => {
                if (options && options.session) {
                    return Promise.resolve("deleted doc with session");
                }
                return Promise.resolve("deleted doc without session");
            }),
    
            deleteMany: jest.fn(() => Promise.resolve({ deletedCount: 2 })),
        };
    
        service = new AbstractService(fakeModel);
    });

    // Tests
    test("getDocuments without session", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("docs without session");
        expect(fakeModel.find).toHaveBeenCalled();
    });

    test("getDocuments with session", async () => {
        const fakeSession = {};
        const result = await service.getDocuments(fakeSession);
        expect(result).toBe("docs with session");
        const findResult = fakeModel.find.mock.results[0].value;
        expect(findResult.session).toHaveBeenCalledWith(fakeSession);
    });

    test("getDocumentsQuery without session", async () => {
        const query = service.getDocumentsQuery();
        const result = await query;
        expect(result).toBe("docs without session");
    });

    test("getDocumentsQuery with session", async () => {
        const fakeSession = {};
        const query = service.getDocumentsQuery(fakeSession);
        const result = await query;
        expect(result).toBe("docs with session");
        const findResult = fakeModel.find.mock.results[0].value;
        expect(findResult.session).toHaveBeenCalledWith(fakeSession);
    });

    test("getDocumentsByCustomFilters without session", async () => {
        const filters = { active: true };
        fakeModel.find = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("filtered docs with session"),
        then: function (resolve) {
            return Promise.resolve("filtered docs without session").then(resolve);
        },
        }));
        const result = await service.getDocumentsByCustomFilters(filters);
        expect(result).toBe("filtered docs without session");
        expect(fakeModel.find).toHaveBeenCalledWith(filters);
    });

    test("getDocumentsByCustomFilters with session", async () => {
        const filters = { active: true };
        fakeModel.find = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("filtered docs with session"),
        then: function (resolve) {
            return Promise.resolve("filtered docs without session").then(resolve);
        },
        }));
        const fakeSession = {};
        const result = await service.getDocumentsByCustomFilters(filters, fakeSession);
        expect(result).toBe("filtered docs with session");
        expect(fakeModel.find).toHaveBeenCalledWith(filters);
        const findResult = fakeModel.find.mock.results[0].value;
        expect(findResult.session).toHaveBeenCalledWith(fakeSession);
    });

    test("getDocumentById without session", async () => {
        const id = "someId";
        const result = await service.getDocumentById(id);
        expect(result).toBe("doc found by id without session");
        expect(fakeModel.findById).toHaveBeenCalledWith(id);
    });

    test("getDocumentById with session", async () => {
        const id = "someId";
        const fakeSession = {};
        const result = await service.getDocumentById(id, fakeSession);
        expect(result).toBe("doc found by id with session");
        expect(fakeModel.findById).toHaveBeenCalledWith(id);
        const findByIdResult = fakeModel.findById.mock.results[0].value;
        expect(findByIdResult.session).toHaveBeenCalledWith(fakeSession);
    });

    test("getDocumentsByCustomFiltersQuery without session", async () => {
        const filters = { active: true };
        fakeModel.find = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("filtered docs with session"),
        then: function (resolve) {
            return Promise.resolve("filtered docs without session").then(resolve);
        },
        }));
        const query = service.getDocumentsByCustomFiltersQuery(filters);
        const result = await query;
        expect(result).toBe("filtered docs without session");
        expect(fakeModel.find).toHaveBeenCalledWith(filters);
    });

    test("getDocumentsByCustomFiltersQuery with session", async () => {
        const filters = { active: true };
        fakeModel.find = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("filtered docs with session"),
        then: function (resolve) {
            return Promise.resolve("filtered docs without session").then(resolve);
        },
        }));
        const fakeSession = {};
        const query = service.getDocumentsByCustomFiltersQuery(filters, fakeSession);
        const result = await query;
        expect(result).toBe("filtered docs with session");
        expect(fakeModel.find).toHaveBeenCalledWith(filters);
        const findResult = fakeModel.find.mock.results[0].value;
        expect(findResult.session).toHaveBeenCalledWith(fakeSession);
    });

    test("getDocumentByCustomFilters without session", async () => {
        const filters = { active: true };
        fakeModel.findOne = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("one doc with session"),
        then: function (resolve) {
            return Promise.resolve("one doc without session").then(resolve);
        },
        }));
        const result = await service.getDocumentByCustomFilters(filters);
        expect(result).toBe("one doc without session");
        expect(fakeModel.findOne).toHaveBeenCalledWith(filters);
    });

    test("getDocumentByCustomFilters with session", async () => {
        const filters = { active: true };
        fakeModel.findOne = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("one doc with session"),
        then: function (resolve) {
            return Promise.resolve("one doc without session").then(resolve);
        },
        }));
        const fakeSession = {};
        const result = await service.getDocumentByCustomFilters(filters, fakeSession);
        expect(result).toBe("one doc with session");
        expect(fakeModel.findOne).toHaveBeenCalledWith(filters);
        const findOneResult = fakeModel.findOne.mock.results[0].value;
        expect(findOneResult.session).toHaveBeenCalledWith(fakeSession);
    });

    test("updateDocument without session", async () => {
        const filters = { _id: "docId" };
        const updateFields = { field: "newValue" };
        fakeModel.findOneAndUpdate = jest.fn(() => ({
            session: jest.fn().mockResolvedValue("updated doc with session"),
            then: function (resolve) {
                return Promise.resolve("updated doc without session").then(resolve);
            },
        }));
        const result = await service.updateDocument(filters, updateFields);
        expect(result).toBe("updated doc without session");
        expect(fakeModel.findOneAndUpdate).toHaveBeenCalledWith(filters, updateFields, { new: true });
    });

    test("updateDocument with session", async () => {
        const filters = { _id: "docId" };
        const updateFields = { field: "newValue" };

        fakeModel.findOneAndUpdate = jest.fn((filters, updateFields, options) => {
            return Promise.resolve(
                options && options.session ? "updated doc with session" : "updated doc without session"
            );
        });
        const fakeSession = {};
        const result = await service.updateDocument(filters, updateFields, fakeSession);
        expect(result).toBe("updated doc with session");
        expect(fakeModel.findOneAndUpdate).toHaveBeenCalledWith(filters, updateFields, { new: true, session: fakeSession });
    });

    test("saveDocument without session", async () => {
        fakeModel.create = jest.fn(() => Promise.resolve("created doc"));
        const data = { field: "value" };
        const result = await service.saveDocument(data);
        expect(result).toBe("created doc");
        expect(fakeModel.create).toHaveBeenCalledWith([data]);
    });

    test("saveDocument with session", async () => {
        fakeModel.create = jest.fn(() => Promise.resolve("created doc"));
        const fakeSession = {};
        const data = { field: "value" };
        const result = await service.saveDocument(data, fakeSession);
        expect(result).toBe("created doc");
        expect(fakeModel.create).toHaveBeenCalledWith([data], { session: fakeSession });
    });

    test("saveDocuments without session", async () => {
        fakeModel.insertMany = jest.fn(() => Promise.resolve(["doc1", "doc2"]));
        const data = [{ field: "value1" }, { field: "value2" }];
        const result = await service.saveDocuments(data);
        expect(result).toEqual(["doc1", "doc2"]);
        expect(fakeModel.insertMany).toHaveBeenCalledWith(data);
    });

    test("saveDocuments with session", async () => {
        fakeModel.insertMany = jest.fn(() => Promise.resolve(["doc1", "doc2"]));
        const fakeSession = {};
        const data = [{ field: "value1" }, { field: "value2" }];
        const result = await service.saveDocuments(data, fakeSession);
        expect(result).toEqual(["doc1", "doc2"]);
        expect(fakeModel.insertMany).toHaveBeenCalledWith(data, { session: fakeSession });
    });

    test("deleteDocument without session", async () => {
        fakeModel.findOneAndDelete = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("deleted doc with session"),
        then: function (resolve) {
            return Promise.resolve("deleted doc without session").then(resolve);
        },
        }));
        const filters = { field: "value" };
        const result = await service.deleteDocument(filters);
        expect(result).toBe("deleted doc without session");
        expect(fakeModel.findOneAndDelete).toHaveBeenCalledWith(filters, { new: true });
    });

    test("deleteDocument with session", async () => {
        fakeModel.findOneAndDelete = jest.fn((filters, options) => {
            return Promise.resolve(
                options && options.session ? "deleted doc with session" : "deleted doc without session"
            );
        });
        const fakeSession = {};
        const filters = { field: "value" };
        const result = await service.deleteDocument(filters, fakeSession);
        expect(result).toBe("deleted doc with session");
        expect(fakeModel.findOneAndDelete).toHaveBeenCalledWith(filters, { new: true, session: fakeSession });
    });

    test("deleteDocuments without session", async () => {
        fakeModel.deleteMany = jest.fn(() => Promise.resolve({ deletedCount: 2 }));
        const filters = { field: "value" };
        const result = await service.deleteDocuments(filters);
        expect(result).toEqual({ deletedCount: 2 });
        expect(fakeModel.deleteMany).toHaveBeenCalledWith(filters);
    });

    test("deleteDocuments with session", async () => {
        fakeModel.deleteMany = jest.fn(() => Promise.resolve({ deletedCount: 2 }));
        const fakeSession = {};
        const filters = { field: "value" };
        const result = await service.deleteDocuments(filters, fakeSession);
        expect(result).toEqual({ deletedCount: 2 });
        expect(fakeModel.deleteMany).toHaveBeenCalledWith(filters, { session: fakeSession });
    });

    test("deleteDocumentById without session", async () => {
        fakeModel.findOneAndDelete = jest.fn(() => ({
        session: jest.fn().mockResolvedValue("deleted doc with session"),
        then: function (resolve) {
            return Promise.resolve("deleted doc without session").then(resolve);
        },
        }));
        const id = "docId";
        const result = await service.deleteDocumentById(id);
        expect(result).toBe("deleted doc without session");
        expect(fakeModel.findOneAndDelete).toHaveBeenCalledWith({ _id: id }, { new: true });
    });

    test("deleteDocumentById with session", async () => {
        fakeModel.findOneAndDelete = jest.fn((filters, options) => {
            return Promise.resolve(
                options && options.session ? "deleted doc with session" : "deleted doc without session"
            );
        });
        const fakeSession = {};
        const id = "docId";
        const result = await service.deleteDocumentById(id, fakeSession);
        expect(result).toBe("deleted doc with session");
        expect(fakeModel.findOneAndDelete).toHaveBeenCalledWith({ _id: id }, { new: true, session: fakeSession });
    });
});