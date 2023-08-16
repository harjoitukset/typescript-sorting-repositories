/**
 * See https://open-api.myhelsinki.fi/doc#model-Event
 */
export type Event = {
    name: Name;
    event_dates: EventDates;
    description: EventDescription;
};

/**
 * See https://open-api.myhelsinki.fi/doc#model-EventDates
 */
export type EventDates = {
    starting_day?: string;
    ending_day?: string;
};

/**
 * See https://open-api.myhelsinki.fi/doc#model-Name
 */
export type Name = {
    fi?: string;
    en?: string;
    sv?: string;
    zh?: string;
};

/**
 * See https://open-api.myhelsinki.fi/doc#model-DescriptionTranslated
 */
export type EventDescription = {
    intro?: string;
    body?: string;
};
