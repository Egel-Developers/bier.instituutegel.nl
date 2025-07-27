import type {
	ClientMessage,
	CodeClientMessage,
	RatingExistingBeerClientMessage,
	RatingNewBeerClientMessage,
	UsernameClientMessage
} from './types';

function encodeCode(msg: CodeClientMessage) {
	return JSON.stringify(msg);
}

function encodeUsername(msg: UsernameClientMessage) {
	return JSON.stringify(msg);
}

function encodeRatingNewBeer(msg: RatingNewBeerClientMessage) {
	return JSON.stringify(msg);
}

function encodeRatingExistingBeer(msg: RatingExistingBeerClientMessage) {
	return JSON.stringify(msg);
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
