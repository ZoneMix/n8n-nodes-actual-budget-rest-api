import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { request } from './helpers';

const RESOURCE = 'note';

export const buildNoteRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'get':
			return request('GET', `/v2/notes/${get<string>('noteId')}`);
		case 'update': {
			// The API clears a note with null; an n8n string parameter cannot hold
			// null, so an empty field is what asks for the note to be cleared.
			const note = get<string>('note', '');
			return request('PUT', `/v2/notes/${get<string>('noteId')}`, {
				body: { note: note === '' ? null : note },
			});
		}
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
