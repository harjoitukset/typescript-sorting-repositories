import { filterActiveRepositories } from "./filtering";
import { sortByWatchers } from "./sorting";
import { getRepositories } from "./client";
import { Repository } from "./types/Repository";

/**
 * Fetches repositories from GitHub REST API and prints the active
 * repositories in descending order by their count of watchers.
 */
async function main() {
    try {
        const repositories = await getRepositories("facebook");
        const active = filterActiveRepositories(repositories);
        const sorted = sortByWatchers(active, "desc");

        for (let repo of sorted) {
            console.log(repo.name, repo.watchers_count);
        }

    } catch (error) {
        console.error(error);
    }
}

main();
