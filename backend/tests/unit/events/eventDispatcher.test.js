const EventDispatcher = require('../../../events/eventDispatcher');

describe('EventDispatcher Unit Test', () => {
    beforeEach(() => {
        EventDispatcher.listeners = [];
    });

    it('should register a listener for an event', async () => {
        const mockListener = jest.fn();
        await EventDispatcher.registerListener('test-event', mockListener);

        expect(EventDispatcher.listeners['test-event']).toContain(mockListener);
    });

    it('should dispatch an event to the registered listeners', async () => {
        const mockListener = jest.fn();
        await EventDispatcher.registerListener('dispatch-event', mockListener);

        await EventDispatcher.dispatchEvent('dispatch-event', { message: 'Hello' });

        expect(mockListener).toHaveBeenCalledWith({ message: 'Hello' });
    });

    it('should not throw if dispatching an event with no listeners', async () => {
        await expect(EventDispatcher.dispatchEvent('no-listeners-event', {})).resolves.not.toThrow();
    });

    it('should deprovision (remove) a listener from an event', async () => {
        const mockListener = jest.fn();
        await EventDispatcher.registerListener('remove-event', mockListener);
        await EventDispatcher.deprovisionListener('remove-event', mockListener);

        expect(EventDispatcher.listeners['remove-event']).not.toContain(mockListener);
    });

    it('should do nothing when deprovisioning from an event with no listeners', async () => {
        await expect(EventDispatcher.deprovisionListener('nonexistent-event', jest.fn())).resolves.not.toThrow();
    });
});
