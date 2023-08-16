import { Repository } from "./types/Repository";
import fetch from "node-fetch";


/**
 * Fetches a list of public repositories in the given organization.
 *
 * @see https://docs.github.com/en/rest/repos/repos
 *
 * @param organization name of the organization
 * @param [limit=100] Count of repositories to include. Maximum value is 100.
 * @returns array of repositories
 */
export async function getRepositories(organization: string, limit: number = 100): Promise<Repository[]> {
    let response = await fetch(`https://api.github.com/orgs/${organization}/repos?per_page=${limit}`);

    if (!response.ok) {
        throw new Error(`Got HTTP status ${response.status} (${response.statusText}) when fetching repositories.`);
    }

    return await response.json() as Repository[];
}