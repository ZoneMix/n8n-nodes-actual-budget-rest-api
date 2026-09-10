import { describe, it, assert } from '../harness.mjs';
import { buildAccountGroupRequest } from '../../nodes/ActualBudgetRestApi/requests/accountGroup';
import { buildNoteRequest } from '../../nodes/ActualBudgetRestApi/requests/note';
import { buildPreferenceRequest } from '../../nodes/ActualBudgetRestApi/requests/preference';
import { buildTagRequest } from '../../nodes/ActualBudgetRestApi/requests/tag';
import { noParams, params } from '../support';

describe('tag request builder', () => {
	it('lists tags', () => {
		assert.deepEqual(buildTagRequest('getAll', noParams()), {
			method: 'GET',
			endpoint: '/v2/tags',
		});
	});

	it('creates a tag', () => {
		const get = params({ tagName: 'travel', additionalFields: {} });
		assert.deepEqual(buildTagRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/tags',
			body: { tag: { tag: 'travel' } },
		});
	});

	it('creates a tag with a colour and description', () => {
		const get = params({
			tagName: 'travel',
			additionalFields: { color: '#ff0000', description: 'Trips' },
		});
		assert.deepEqual(buildTagRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/tags',
			body: { tag: { tag: 'travel', color: '#ff0000', description: 'Trips' } },
		});
	});

	it('updates a tag', () => {
		const get = params({ tagId: 't1', updateFields: { color: '#00ff00' } });
		assert.deepEqual(buildTagRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/tags/t1',
			body: { fields: { color: '#00ff00' } },
		});
	});

	it('deletes a tag', () => {
		assert.deepEqual(buildTagRequest('delete', params({ tagId: 't1' })), {
			method: 'DELETE',
			endpoint: '/v2/tags/t1',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildTagRequest('merge', noParams()), {
			message: 'Unsupported tag operation: merge',
		});
	});
});

describe('note request builder', () => {
	it('reads the note of any entity', () => {
		assert.deepEqual(buildNoteRequest('get', params({ noteId: 'a1' })), {
			method: 'GET',
			endpoint: '/v2/notes/a1',
		});
	});

	it('writes a note', () => {
		assert.deepEqual(buildNoteRequest('update', params({ noteId: 'a1', note: 'Checked' })), {
			method: 'PUT',
			endpoint: '/v2/notes/a1',
			body: { note: 'Checked' },
		});
	});

	it('turns an empty note into the null the API clears with', () => {
		assert.deepEqual(buildNoteRequest('update', params({ noteId: 'a1', note: '' })), {
			method: 'PUT',
			endpoint: '/v2/notes/a1',
			body: { note: null },
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildNoteRequest('delete', noParams()), {
			message: 'Unsupported note operation: delete',
		});
	});
});

describe('preference request builder', () => {
	it('reads the budget preferences', () => {
		assert.deepEqual(buildPreferenceRequest('get'), {
			method: 'GET',
			endpoint: '/v2/preferences',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildPreferenceRequest('set'), {
			message: 'Unsupported preference operation: set',
		});
	});
});

describe('account group request builder', () => {
	it('lists account groups', () => {
		assert.deepEqual(buildAccountGroupRequest('getAll', noParams()), {
			method: 'GET',
			endpoint: '/v2/account-groups',
		});
	});

	it('creates an account group', () => {
		assert.deepEqual(buildAccountGroupRequest('create', params({ groupName: 'Cash' })), {
			method: 'POST',
			endpoint: '/v2/account-groups',
			body: { group: { name: 'Cash' } },
		});
	});

	it('updates an account group', () => {
		const get = params({ accountGroupId: 'g1', updateFields: { name: 'Savings' } });
		assert.deepEqual(buildAccountGroupRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/account-groups/g1',
			body: { fields: { name: 'Savings' } },
		});
	});

	it('deletes an account group', () => {
		assert.deepEqual(buildAccountGroupRequest('delete', params({ accountGroupId: 'g1' })), {
			method: 'DELETE',
			endpoint: '/v2/account-groups/g1',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildAccountGroupRequest('reorder', noParams()), {
			message: 'Unsupported account group operation: reorder',
		});
	});
});
