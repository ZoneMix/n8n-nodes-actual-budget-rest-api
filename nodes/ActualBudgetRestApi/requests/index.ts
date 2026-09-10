import type { BuiltRequest, ParamGetter, RequestBuilder } from './types';
import { unsupportedResource } from './types';
import { buildAccountRequest } from './account';
import { buildAccountGroupRequest } from './accountGroup';
import { buildBankSyncRequest } from './bankSync';
import { buildBudgetRequest } from './budget';
import { buildCategoryRequest } from './category';
import { buildCategoryGroupRequest } from './categoryGroup';
import { buildHealthRequest } from './health';
import { buildMetricsRequest } from './metrics';
import { buildNoteRequest } from './note';
import { buildPayeeRequest } from './payee';
import { buildPreferenceRequest } from './preference';
import { buildQueryRequest } from './query';
import { buildRuleRequest } from './rule';
import { buildScheduleRequest } from './schedule';
import { buildSystemRequest } from './system';
import { buildTagRequest } from './tag';
import { buildTransactionRequest } from './transaction';

/** Every resource the node exposes, mapped to the builder that owns its endpoints. */
export const RESOURCE_BUILDERS: Record<string, RequestBuilder> = {
	account: buildAccountRequest,
	accountGroup: buildAccountGroupRequest,
	bankSync: buildBankSyncRequest,
	budget: buildBudgetRequest,
	category: buildCategoryRequest,
	categoryGroup: buildCategoryGroupRequest,
	health: buildHealthRequest,
	metrics: buildMetricsRequest,
	note: buildNoteRequest,
	payee: buildPayeeRequest,
	preference: buildPreferenceRequest,
	query: buildQueryRequest,
	rule: buildRuleRequest,
	schedule: buildScheduleRequest,
	system: buildSystemRequest,
	tag: buildTagRequest,
	transaction: buildTransactionRequest,
};

/** Turns the node's resource/operation selection into one HTTP request. */
export const buildRequest = (
	resource: string,
	operation: string,
	get: ParamGetter,
): BuiltRequest => {
	const builder = RESOURCE_BUILDERS[resource];
	if (!builder) {
		throw unsupportedResource(resource);
	}
	return builder(operation, get);
};
