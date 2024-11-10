
class AbstractService {
    //implement in base class
    async updateData(data) {
        throw new Error("Method not implemented");
    }

    async saveData(data) {
        throw new Error("Method not implemented");
    }

    async deleteData(data) {
        throw new Error("Method not implemented");
    }
}
module.exports = AbstractService;
