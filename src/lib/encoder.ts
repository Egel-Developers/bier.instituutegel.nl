import type {
	ClientMessage,
	CodeClientMessage,
	RatingExistingBeerClientMessage,
	RatingNewBeerClientMessage,
	UsernameClientMessage
} from './types';

function encodeCode(msg: CodeClientMessage) {
	const encoder = new TextEncoder();
	const codeBytes = encoder.encode(msg.code);

	const bytes = [
		0, // messageType
		codeBytes.length, // code length
		...codeBytes // code
	];

	return Uint8Array.from(bytes);
	// return JSON.stringify(msg);
}

function encodeUsername(msg: UsernameClientMessage) {
	const encoder = new TextEncoder();
	const codeBytes = encoder.encode(msg.code);
	const nameBytes = encoder.encode(msg.username);

	const bytes = [
		1, // messageType
		codeBytes.length,
		...codeBytes,
		nameBytes.length,
		...nameBytes
	];

	return Uint8Array.from(bytes);
	// return JSON.stringify(msg);
}

function encodeRatingNewBeer(msg: RatingNewBeerClientMessage) {
	const encoder = new TextEncoder();
	const codeBytes = encoder.encode(msg.code);
	const beerBytes = encoder.encode(msg.beer);

	const bytes = [
		2, // messageType
		codeBytes.length,
		...codeBytes,
		msg.user_id,
		msg.rating,
		beerBytes.length,
		...beerBytes
	];

	return Uint8Array.from(bytes);
	// return JSON.stringify(msg);
}

function encodeRatingExistingBeer(msg: RatingExistingBeerClientMessage) {
	const encoder = new TextEncoder();
	const codeBytes = encoder.encode(msg.code);

	const bytes = [
		3, // messageType
		codeBytes.length,
		...codeBytes,
		msg.user_id,
		msg.rating,
		msg.beer_id
	];

	return Uint8Array.from(bytes);
	// return JSON.stringify(msg);
}

function encode(msg: ClientMessage) {
	switch (msg.messageType) {
		case 0:
			return encodeCode(msg);
		case 1:
			return encodeUsername(msg);
		case 2:
			return encodeRatingNewBeer(msg);
		case 3:
			return encodeRatingExistingBeer(msg);
		default:
			throw new Error(`Unhandled message type: ${msg}`);
	}
}

export const Encoder = { encode };
