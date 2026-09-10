import { describe, it, assert } from '../harness.mjs';
import { buildCategoryRequest } from '../../nodes/ActualBudgetRestApi/requests/category';
import { buildCategoryGroupRequest } from '../../nodes/ActualBudgetRestApi/requests/categoryGroup';
import { noParams, params } from '../support';

describe('category request builder', () => {
	it('lists categories', () => {
		assert.deepEqual(buildCategoryRequest('getAll', params({ filters: {} })), {
			method: 'GET',
			endpoint: '/v2/categories',
		});
	});

	it('filters the list by hidden', () => {
		assert.deepEqual(buildCategoryRequest('getAll', params({ filters: { hidden: true } })), {
			method: 'GET',
			endpoint: '/v2/categories',
			qs: { hidden: true },
		});
	});

	it('keeps hidden=false in the query string', () => {
		assert.deepEqual(buildCategoryRequest('getAll', params({ filters: { hidden: false } })), {
			method: 'GET',
			endpoint: '/v2/categories',
			qs: { hidden: false },
		});
	});

	it('creates a category', () => {
		const get = params({ categoryName: 'Groceries', groupId: 'g1', additionalFields: {} });
		assert.deepEqual(buildCategoryRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/categories',
			body: { category: { name: 'Groceries', group_id: 'g1' } },
		});
	});

	it('creates a hidden category', () => {
		const get = params({
			categoryName: 'Old',
			groupId: 'g1',
			additionalFields: { hidden: true },
		});
		assert.deepEqual(buildCategoryRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/categories',
			body: { category: { name: 'Old', group_id: 'g1', hidden: true } },
		});
	});

	it('updates a category', () => {
		const get = params({ categoryId: 'c1', updateFields: { name: 'Food' } });
		assert.deepEqual(buildCategoryRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/categories/c1',
			body: { fields: { name: 'Food' } },
		});
	});

	it('deletes a category', () => {
		const get = params({ categoryId: 'c1', transferCategoryId: '' });
		assert.deepEqual(buildCategoryRequest('delete', get), {
			method: 'DELETE',
			endpoint: '/v2/categories/c1',
		});
	});

	it('deletes a category and moves its transactions', () => {
		const get = params({ categoryId: 'c1', transferCategoryId: 'c2' });
		assert.deepEqual(buildCategoryRequest('delete', get), {
			method: 'DELETE',
			endpoint: '/v2/categories/c1',
			qs: { transferCategoryId: 'c2' },
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildCategoryRequest('merge', noParams()), {
			message: 'Unsupported category operation: merge',
		});
	});
});

describe('category group request builder', () => {
	it('lists category groups', () => {
		assert.deepEqual(buildCategoryGroupRequest('getAll', params({ filters: {} })), {
			method: 'GET',
			endpoint: '/v2/category-groups',
		});
	});

	it('filters the list by hidden', () => {
		assert.deepEqual(buildCategoryGroupRequest('getAll', params({ filters: { hidden: true } })), {
			method: 'GET',
			endpoint: '/v2/category-groups',
			qs: { hidden: true },
		});
	});

	it('creates a category group', () => {
		const get = params({ groupName: 'Bills', isIncome: false, additionalFields: {} });
		assert.deepEqual(buildCategoryGroupRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/category-groups',
			body: { group: { name: 'Bills', is_income: false } },
		});
	});

	it('creates a hidden income group', () => {
		const get = params({ groupName: 'Income', isIncome: true, additionalFields: { hidden: true } });
		assert.deepEqual(buildCategoryGroupRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/category-groups',
			body: { group: { name: 'Income', is_income: true, hidden: true } },
		});
	});

	it('updates a category group', () => {
		const get = params({ groupId: 'g1', updateFields: { name: 'Fixed' } });
		assert.deepEqual(buildCategoryGroupRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/category-groups/g1',
			body: { fields: { name: 'Fixed' } },
		});
	});

	it('deletes a category group and moves its categories', () => {
		const get = params({ groupId: 'g1', transferCategoryId: 'c2' });
		assert.deepEqual(buildCategoryGroupRequest('delete', get), {
			method: 'DELETE',
			endpoint: '/v2/category-groups/g1',
			qs: { transferCategoryId: 'c2' },
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildCategoryGroupRequest('reorder', noParams()), {
			message: 'Unsupported category group operation: reorder',
		});
	});
});
