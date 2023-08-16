import { Repository } from "./types/Repository";

/**
 * Returns a **new** array, where all Repositories from
 * the given array are sorted by their `watchers_count`.
 *
 * Caller can specify to sort the watchers in ascending
 * order (low to high) or descending order (from high to low).
 *
 * @param repositories to use in sorting
 * @param order either ascending ("asc") or descending ("desc") order.
 */
export function sortByWatchers(repos: Repository[], order: "asc" | "desc"): Repository[] {
    // Do not use the built -in `Array.sort` method!
    // You must implement the sorting logic yourself.

    // todo: make sorted copy of the given array
    return repos;
}