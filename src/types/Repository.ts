// see https://docs.github.com/en/rest/repos/repos#list-organization-repositories--code-samples
export interface Repository {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
        login: string;
        id: number;
    };
    html_url: string;
    description: string;
    url: string;
    created_at?: string;
    updated_at?: string;
    pushed_at?: string;
    git_url?: string;
    homepage?: string;
    watchers_count?: number;
    language?: string;
    archived?: boolean;
}
