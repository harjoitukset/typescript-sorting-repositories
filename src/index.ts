import { filterActiveRepositories } from "./filtering";
import { sortByWatchers } from "./sorting";
import { getRepositories } from "./client";
import { Repository } from "./types/Repository";

/**
 * Fetches repositories from GitHub REST API. Then filters active
 * repositories and prints them in descending order by their count
 * of watchers.
 */
async function main() {
    let params: string[] = process.argv;

    if (params.length != 3) {
        console.error(`Usage: npm start [organization]`);
        console.error(`Example: npm start microsoft`);
        return;
    }

    try {
        let organization = params.at(2)!;

        const repositories = await getRepositories(organization);
        const active = filterActiveRepositories(repositories);
        const sorted = sortByWatchers(active, "desc");

        sorted.forEach(printRepository);

    } catch (error) {
        console.error(error);
    }
}

function printRepository(repo: Repository): void {
    console.log(`* ${repo.name}`);
    console.log(`  * ⭐ ${repo.watchers_count}`);
    console.log(`  * ${repo.description}`);
    console.log(`  * ${repo.language}`);
    console.log();
}

main();
