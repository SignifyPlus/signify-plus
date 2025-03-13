const TimeUtils = require("../../utilities/timeUtils");

describe("TimeUtils", () => {
    test("getCurrentTimeInMilliSeconds should return a number greater than 0", () => {
        const timeMs = TimeUtils.getCurrentTimeInMilliSeconds();
        expect(typeof timeMs).toBe("number");
        expect(timeMs).toBeGreaterThan(0);
    });

    test("getCurrentTimeInSeconds should return a number greater than 0", () => {
        const timeSec = TimeUtils.getCurrentTimeInSeconds();
        expect(typeof timeSec).toBe("number");
        expect(timeSec).toBeGreaterThan(0);
    });

    test("getTimeDifferenceInSecondsFromNow should return a small difference when given the current time", () => {
        const now = TimeUtils.getCurrentTimeInSeconds();
        const diff = TimeUtils.getTimeDifferenceInSecondsFromNow(now);
        expect(diff).toBeLessThanOrEqual(1);
    });

    test("getTimeInSeconds should convert milliseconds to seconds correctly", () => {
        expect(TimeUtils.getTimeInSeconds(1000)).toBe(1);
        expect(TimeUtils.getTimeInSeconds(1500)).toBe(1);
        expect(TimeUtils.getTimeInSeconds(1999)).toBe(1);
        expect(TimeUtils.getTimeInSeconds(2000)).toBe(2);
    });

    test("isTimeDifferenceLessThanElapsedLimit should return true when the time difference is within the elapsed limit", () => {
        const now = TimeUtils.getCurrentTimeInSeconds();
        expect(TimeUtils.isTimeDifferenceLessThanElapsedLimit(5, now)).toBe(true);
    });

    test("isTimeDifferenceLessThanElapsedLimit should return false when the time difference exceeds the elapsed limit", () => {
        const now = TimeUtils.getCurrentTimeInSeconds();
        const past = now - 10;
        expect(TimeUtils.isTimeDifferenceLessThanElapsedLimit(5, past)).toBe(false);
    });
});