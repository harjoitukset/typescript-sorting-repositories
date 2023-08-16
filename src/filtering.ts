import { Event } from "./types/Event";

/**
 * Returns a new array of Events that only contains those events from the given `events` array
 * that have their starting_day between the two given `Date` objects.
 */
export function filterEventsByStartDate(events: Event[], minDate: Date, maxDate: Date): Event[] {
    return events;
}
