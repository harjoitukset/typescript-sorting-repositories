import { test, describe, expect } from '@jest/globals';
import { strict as assert } from 'node:assert';
import { Repository } from './types/Repository';
import { filterActiveRepositories } from './filtering';

// a constant object that can be used when creating test data
const repository: Repository = Object.freeze({
    id: 1,
    name: "demo",
    full_name: "ohjelmistokehitys/demo",
    private: false,
    owner: {
        login: "ohjelmistokehitys",
        id: 2
    },
    html_url: "",
    description: "",
    url: "",
    created_at: "",
    updated_at: "",
    pushed_at: "",
    git_url: "",
    homepage: "",
    watchers_count: 12345,
    language: "",
    archived: false
});


describe('filtering archived repositories', () => {

    const archivedRepo: Repository = { ...repository, id: 1, archived: true };
    const activeRepo: Repository = { ...repository, id: 3, archived: false };

    test('archived repositories are excluded', () => {
        let filtered = filterActiveRepositories([activeRepo, archivedRepo]);
        assert.ok(!filtered.includes(archivedRepo), `Archived repository should not be included in result`);
    });

    test('active repositories are included in array', () => {
        let filtered = filterActiveRepositories([activeRepo, archivedRepo]);
        assert.ok(filtered.includes(activeRepo), `Active repository should be included in result`);
    });

    test('function does not modify the given array', () => {
        let repositories = [activeRepo, archivedRepo];
        let filtered = filterActiveRepositories([activeRepo, archivedRepo]);

        assert.equal(1, filtered.length, `filtered array must contain only one repository`);
        assert.equal(2, repositories.length, `filtering must create a new array and not modify the given one`);
    });
});

