const UpdateUserDto = require('../../../dtos/UpdateUserDto');

describe('UpdateUserDto', () => {
    it('should correctly assign all properties', () => {
        const userId = 'user1';
        const name = 'Alice';
        const phoneNumber = '+1234567890';
        const password = 'securepass';
        const profilePicture = 'pic.jpg';
        const profileStatus = 'Online';

        const dto = new UpdateUserDto(
            userId,
            name,
            phoneNumber,
            password,
            profilePicture,
            profileStatus
        );

        expect(dto.userId).toBe(userId);
        expect(dto.name).toBe(name);
        expect(dto.phoneNumber).toBe(phoneNumber);
        expect(dto.password).toBe(password);
        expect(dto.profilePicture).toBe(profilePicture);
        expect(dto.profileStatus).toBe(profileStatus);
    });

    it('should allow different values for all properties', () => {
        const userId = 'user2';
        const name = 'Bob';
        const phoneNumber = '+0987654321';
        const password = 'anotherpass';
        const profilePicture = 'avatar.png';
        const profileStatus = 'Away';

        const dto = new UpdateUserDto(
            userId,
            name,
            phoneNumber,
            password,
            profilePicture,
            profileStatus
        );

        expect(dto.userId).toBe('user2');
        expect(dto.name).toBe('Bob');
        expect(dto.phoneNumber).toBe('+0987654321');
        expect(dto.password).toBe('anotherpass');
        expect(dto.profilePicture).toBe('avatar.png');
        expect(dto.profileStatus).toBe('Away');
    });
});