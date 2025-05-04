const SignifyPlusDIContainer = require('../../../container/signifyPlusDIContainer');
const EventDispatcher = require('../../../events/eventDispatcher');

describe('SignifyPlusDIContainer Unit Test', () => {
    it('should bind EventDispatcher as a singleton', () => {
        const containerInstance = new SignifyPlusDIContainer();

        const dispatcher1 = containerInstance.container.get(EventDispatcher);
        const dispatcher2 = containerInstance.container.get(EventDispatcher);

        expect(dispatcher1).toBeInstanceOf(EventDispatcher);
        expect(dispatcher1).toBe(dispatcher2); // singleton instance
    });
});