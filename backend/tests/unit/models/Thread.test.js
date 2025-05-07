const mongoose = require('mongoose');
const Thread = require('../../../models/Thread');

describe('Thread Model', () => {
    it('should require createdBy', () => {
        const t = new Thread({ title: 'Sample Thread' });
        const err = t.validateSync();
        expect(err).toBeDefined();
        expect(err.errors.createdBy).toBeDefined();
    });

    it('should accept optional title', () => {
        const userId = new mongoose.Types.ObjectId();
        const t = new Thread({ createdBy: userId });
        const err = t.validateSync();
        expect(err).toBeUndefined();
        expect(t.title).toBeUndefined();
    });

    it('should allow title to be set', () => {
        const userId = new mongoose.Types.ObjectId();
        const title = 'My Thread Title';
        const t = new Thread({ createdBy: userId, title });
        const err = t.validateSync();
        expect(err).toBeUndefined();
        expect(t.title).toBe(title);
    });

    it('should default active to true', () => {
        const userId = new mongoose.Types.ObjectId();
        const t = new Thread({ createdBy: userId });
        expect(t.active).toBe(true);
    });

    it('should set createdAt to a Date instance', () => {
        const userId = new mongoose.Types.ObjectId();
        const t = new Thread({ createdBy: userId });
        expect(t.createdAt).toBeInstanceOf(Date);
    });
});