import { test, describe, expect } from '@jest/globals';
import { strict as assert } from 'node:assert';
import { Repository } from './types/Repository';
import { sortByWatchers } from './sorting';

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

describe('sorting repositories by watchers count', () => {
    const repo0: Repository = { ...repository, watchers_count: 0 };
    const repo10: Repository = { ...repository, watchers_count: 10 };
    const repo100: Repository = { ...repository, watchers_count: 100 };

    const unordered = [repo100, repo0, repo10];

    test('repos can be sorted in ascending order', () => {
        let sorted = sortByWatchers(unordered, "asc")

        assert.deepEqual(sorted, [repo0, repo10, repo100]);
    });

    test('repos can be sorted in descending order', () => {
        let sorted = sortByWatchers(unordered, "desc")

        assert.deepEqual(sorted, [repo100, repo10, repo0]);
    });

    test('sorting an empty array should not throw exceptions', () => {
        let sorted = sortByWatchers([], "asc");

        assert.deepEqual(sorted, []);
    });

    test('sorting should not modify the original array', () => {
        let original = [...unordered];
        let sorted = sortByWatchers(unordered, "desc");

        assert.deepEqual(original, [repo100, repo0, repo10]);
    });

    test('sorting is not allowed to utilize Array.sort', () => {
        // this function will replace `Array.sort` and throw an exception if called:
        let notAllowed = (compareFn?: ((a: any, b: any) => number)): any[] => {
            throw new Error('Using Array.sort is not allowed in the exercise!');
        };
        jest.spyOn(Array.prototype, 'sort').mockImplementation(notAllowed);

        // if Array.sort is called inside the function, an error will be thrown here
        sortByWatchers(unordered, "asc");

        // if we got past the previous step, the test should always pass
        assert.ok(true, 'Array.sort was not called');
    });
});
