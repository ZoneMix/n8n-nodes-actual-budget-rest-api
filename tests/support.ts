import type { ParamGetter } from '../nodes/ActualBudgetRestApi/requests/types';

/**
 * Builds a `ParamGetter` over a plain object. Reading a parameter that the test
 * did not supply and that has no fallback throws, the same way n8n's own
 * `getNodeParameter` does — so a builder that reads an undeclared parameter
 * fails the test instead of silently sending `undefined`.
 */
export const params = (values: Record<string, unknown>): ParamGetter =>
	<T>(name: string, fallback?: T): T => {
		if (name in values) {
			return values[name] as T;
		}
		if (fallback !== undefined) {
			return fallback;
		}
		throw new Error(`Missing node parameter: ${name}`);
	};

/** Empty parameter set, for operations that read nothing. */
export const noParams = (): ParamGetter => params({});
