import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { request } from './helpers';

const RESOURCE = 'note';

export const buildNoteRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'get':
			return request('GET', `/v2/notes/${get<string>('noteId')}`);
		case 'update':
			// An empty string is a real value here: it clears the note.
			return request('PUT', `/v2/notes/${get<string>('noteId')}`, {
				body: { note: get<string>('note', '') },
			});
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
