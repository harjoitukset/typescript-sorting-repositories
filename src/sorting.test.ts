import { test, describe, expect } from '@jest/globals';
import { strict as assert } from 'node:assert';
import { Event } from './types/Event';
import { sortEventsByStartDate } from './sorting';

/** Creates an Event with the given date. Useful for testing. */
function createTestEvent(startingDay?: string): Event {
    return {
        name: {},
        description: {},
        event_dates: {
            starting_day: startingDay
        }
    };
}

describe('sorting events by starting date', () => {
    const first: Event = createTestEvent('2024-12-31T16:00:00.000Z');
    const second: Event = createTestEvent('2025-01-05T16:00:00.000Z');
    const third: Event = createTestEvent('2025-01-10T16:00:00.000Z');

    const unordered = [third, first, second];

    test('events are sorted in correct order', () => {
        let sorted = sortEventsByStartDate(unordered);

        assert.deepEqual(sorted, [first, second, third]);
    });

    test('sorting handles events with identical dates correctly', () => {
        let unorderedTwice = [...unordered, ...unordered];
        let sorted = sortEventsByStartDate(unorderedTwice);

        assert.deepEqual(sorted, [first, first, second, second, third, third]);
    });

    test('sorting an empty array should not throw exceptions', () => {
        let sorted = sortEventsByStartDate([]);

        assert.deepEqual(sorted, []);
    });

    test('sorting events without dates should not throw exceptions', () => {
        let noDate = createTestEvent(undefined);
        let sorted = sortEventsByStartDate([noDate, noDate]);

        assert.deepEqual(sorted, [noDate, noDate]);
    });

    test('events with no date are in the beginning of the sorted array', () => {
        let noDate = createTestEvent(undefined);

        let original = [third, noDate, first, noDate, second];
        let sorted = sortEventsByStartDate(original);

        assert.deepEqual(sorted, [noDate, noDate, first, second, third]);
    });

    test('sorting does not modify the original array', () => {
        sortEventsByStartDate(unordered);

        assert.deepEqual(unordered, [third, first, second]);
    });

    test('sorting is not allowed to utilize Array.sort', () => {
        // this function will replace `Array.sort` and throw an exception if called:
        let notAllowed = (compareFn?: ((a: any, b: any) => number)): any[] => {
            throw new Error('Using Array.sort is not allowed in the exercise!');
        };
        jest.spyOn(Array.prototype, 'sort').mockImplementation(notAllowed);

        // if Array.sort is called inside the function, an error will be thrown
        sortEventsByStartDate(unordered);

        assert.ok(true, 'Array.sort was not called');
    });

});
