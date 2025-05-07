const mongoose = require('mongoose');
const Comment = require('../../../models/Comment');

describe('Comment Model', () => {
    it('should require content', () => {
        const c = new Comment({ createdBy: new mongoose.Types.ObjectId() });
        const err = c.validateSync();
        expect(err).toBeDefined();
        expect(err.errors.content).toBeDefined();
    });

    it('should require createdBy', () => {
        const c = new Comment({ content: 'Hello world' });
        const err = c.validateSync();
        expect(err).toBeDefined();
        expect(err.errors.createdBy).toBeDefined();
    });

    it('should accept optional mediaId', () => {
        const mediaId = new mongoose.Types.ObjectId();
        const c = new Comment({
            content: 'With media',
            createdBy: new mongoose.Types.ObjectId(),
            mediaId,
        });
        const err = c.validateSync();
        expect(err).toBeUndefined();
        expect(c.mediaId).toEqual(mediaId);
    });

    it('should default active to true', () => {
        const c = new Comment({
            content: 'Check default active',
            createdBy: new mongoose.Types.ObjectId(),
        });
        expect(c.active).toBe(true);
    });

    it('should set createdAt to a Date', () => {
        const c = new Comment({
            content: 'Timestamp test',
            createdBy: new mongoose.Types.ObjectId(),
        });
        expect(c.createdAt).toBeInstanceOf(Date);
    });
});