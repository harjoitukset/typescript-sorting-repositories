import { test, describe, expect } from '@jest/globals';
import { strict as assert } from 'node:assert';
import { Event } from './types/Event';
import { filterEventsByStartDate } from './filtering';

function createTestEvent(startingDay?: string): Event {
    return {
        name: {},
        description: {},
        event_dates: {
            starting_day: startingDay
        }
    };
}


describe('filtering events', () => {
    const from = new Date('2025-01-01T16:00:00.000Z');
    const to = new Date('2025-01-08T16:00:00.000Z');

    const past: Event = createTestEvent('2024-12-31T16:00:00.000Z');
    const inRange: Event = createTestEvent('2025-01-05T16:00:00.000Z');
    const future: Event = createTestEvent('2025-01-10T16:00:00.000Z');
    const noDate: Event = createTestEvent(undefined);

    const events = [past, inRange, future, noDate];

    test('events with no date are excluded', () => {
        let filtered = filterEventsByStartDate(events, from, to);
        assert.ok(!filtered.includes(noDate), `events without a starting date should not be included`);
    });

    test('past events are excluded', () => {
        let filtered = filterEventsByStartDate(events, from, to);
        assert.ok(!filtered.includes(past), `event on ${past.event_dates.starting_day} should not be included in range ${from.toISOString()} - ${to.toISOString()}`);
    });

    test('future events are excluded', () => {
        let filtered = filterEventsByStartDate(events, from, to);
        assert.ok(!filtered.includes(future), `event on ${future.event_dates.starting_day} should not be included in range ${from.toISOString()} - ${to.toISOString()}`);
    });

    test('events in the range are included', () => {
        let filtered = filterEventsByStartDate(events, from, to);
        assert.ok(filtered.includes(inRange), `event on ${inRange.event_dates.starting_day} should be included in range ${from.toISOString()} - ${to.toISOString()}`);
    });

    test('function does not modify the given array', () => {
        filterEventsByStartDate(events, from, to);

        assert.equal(4, events.length, `filtering must create a new array and not modify the given one`);
    });
});

