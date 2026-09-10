import { describe, it, assert } from './harness.mjs';
import {
	omitBlank,
	parseJsonArray,
	parseJsonObject,
	parseJsonObjectOrArray,
	request,
	splitList,
	updateBody,
} from '../nodes/ActualBudgetRestApi/requests/helpers';

describe('request helpers', () => {
	it('drops blank values without touching the source object', () => {
		const source = { a: 1, b: '', c: null, d: undefined, e: false, f: 0 };
		assert.deepEqual(omitBlank(source), { a: 1, e: false, f: 0 });
		assert.deepEqual(Object.keys(source).length, 6);
	});

	it('splits and trims comma separated lists', () => {
		assert.deepEqual(splitList('a, b ,c,,'), ['a', 'b', 'c']);
		assert.deepEqual(splitList(''), []);
	});

	it('omits an empty body and query string', () => {
		assert.deepEqual(request('GET', '/v2/accounts', { body: {}, qs: {} }), {
			method: 'GET',
			endpoint: '/v2/accounts',
		});
	});

	it('keeps a populated body, query string and binary target', () => {
		assert.deepEqual(
			request('POST', '/v2/budget/export', {
				body: { a: 1 },
				qs: { b: 2 },
				binary: { fileName: 'budget.zip', mimeType: 'application/zip' },
			}),
			{
				method: 'POST',
				endpoint: '/v2/budget/export',
				body: { a: 1 },
				qs: { b: 2 },
				binary: { fileName: 'budget.zip', mimeType: 'application/zip' },
			},
		);
	});

	it('wraps update fields and drops an empty set', () => {
		assert.deepEqual(updateBody({ name: 'x' }), { fields: { name: 'x' } });
		assert.deepEqual(updateBody({}), {});
	});

	it('parses JSON objects and arrays', () => {
		assert.deepEqual(parseJsonObject('{"a":1}', 'Filter'), { a: 1 });
		assert.deepEqual(parseJsonArray('[{"a":1}]', 'Operations'), [{ a: 1 }]);
		assert.deepEqual(parseJsonObjectOrArray('[{"a":1}]', 'Filter'), [{ a: 1 }]);
		assert.deepEqual(parseJsonObjectOrArray('{"a":1}', 'Filter'), { a: 1 });
	});

	it('reports malformed JSON with the parameter name', () => {
		assert.throws(() => parseJsonObject('{oops', 'Filter'), /^RequestBuildError: Invalid Filter JSON: /);
	});

	it('rejects JSON of the wrong shape', () => {
		assert.throws(() => parseJsonObject('[1]', 'Filter'), {
			message: 'Filter must be a JSON object',
		});
		assert.throws(() => parseJsonArray('{"a":1}', 'Operations'), {
			message: 'Operations must be a JSON array',
		});
		assert.throws(() => parseJsonObjectOrArray('"text"', 'Filter'), {
			message: 'Filter must be a JSON object or array',
		});
	});
});
