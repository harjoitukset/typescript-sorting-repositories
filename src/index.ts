import { filterEventsByStartDate } from "./filtering";
import { sortEventsByStartDate } from "./sorting";
import { getEvents } from "./client";
import { Event } from "./types/Event";

const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 1_000;

/**
 * Fetches events from MyHelsinki Open API and prints the events starting during
 * the next week in ascending order.
 */
async function main() {
    try {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + MILLISECONDS_PER_WEEK);

        const allEvents: Event[] = await getEvents();
        const eventsNextWeek = filterEventsByStartDate(allEvents, now, nextWeek);

        printEvents(eventsNextWeek);

    } catch (error) {
        console.error(error);
    }
}

/**
 * Prints the given array of events in ascending order by their starting times. For each day,
 * the date is printed before the events starting during that day. Date and time formatting
 * utilizes the user's locale.
 */
function printEvents(events: Event[]) {
    const sortedByStartDate = sortEventsByStartDate(events);

    console.log(`# Events from MyHelsinki Open API`);

    // keep track of the previous date, so we can log each day only once
    let previousDate = '';

    for (let event of sortedByStartDate) {
        let name = getName(event);

        let isoDateTime = event.event_dates.starting_day;
        let date = isoDateTime ? new Date(isoDateTime).toLocaleDateString() : 'no date';
        let time = isoDateTime ? new Date(isoDateTime).toLocaleTimeString() : 'no time';

        // if this is the first event for a day, print also the date
        if (date !== previousDate) {
            console.log(`\n## ${date}\n`);
            previousDate = date;
        }

        console.log(` * ${time}: ${name}`);
    }
}

/**
 * Returns the first non-empty name for the given event in the following
 * precedence of languages: Finnish, English, Swedish or Chinese.
 */
function getName(event: Event): string {
    let { fi, en, sv, zh } = event.name;
    return fi ?? en ?? sv ?? zh ?? 'no name';
}

main();
