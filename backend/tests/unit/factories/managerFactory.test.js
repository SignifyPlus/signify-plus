const ManagerFactory = require('../../../factories/managerFactory');

describe('ManagerFactory Unit Test', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the same RabbitMqQueueManager instance', () => {
        const instance1 = ManagerFactory.getRabbitMqQueueManager();
        const instance2 = ManagerFactory.getRabbitMqQueueManager();
        expect(instance1).toBe(instance2);
    });

    it('should return the same RabbitMqProcessorManager instance', () => {
        const instance1 = ManagerFactory.getRabbitMqProcessorManager();
        const instance2 = ManagerFactory.getRabbitMqProcessorManager();
        expect(instance1).toBe(instance2);
    });

    it('should return the same FirebaseManager instance', () => {
        const instance1 = ManagerFactory.getFirebaseManager();
        const instance2 = ManagerFactory.getFirebaseManager();
        expect(instance1).toBe(instance2);
    });
});