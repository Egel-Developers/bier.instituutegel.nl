import type { CodeAccServerMessage, CodeReqServerMessage, InitialServerMessage, RatingServerMessage, ServerMessage, UsernameAccServerMessage, UsernameReqServerMessage } from './types';

function decodeInitial(msg: string): InitialServerMessage {
	return JSON.parse(msg);
}

function decodeCodeReq(msg: string): CodeReqServerMessage {
	return JSON.parse(msg);
}

function decodeCodeAcc(msg: string): CodeAccServerMessage {
	return JSON.parse(msg);
}

function decodeUsernameReq(msg: string): UsernameReqServerMessage {
	return JSON.parse(msg);
}

function decodeUsernameAcc(msg: string): UsernameAccServerMessage {
	return JSON.parse(msg);
}

function decodeRating(msg: string): RatingServerMessage {
	return JSON.parse(msg);
}

function decode(msg: string): ServerMessage {
	// TODO look at first byte
	const { messageType } = JSON.parse(msg);

	switch (messageType) {
		case 0:
			return decodeInitial(msg);
		case 1:
			return decodeCodeReq(msg);
		case 2:
			return decodeCodeAcc(msg);
		case 3:
			return decodeUsernameReq(msg);
		case 4:
			return decodeUsernameAcc(msg);
		case 5:
			return decodeRating(msg);
		default:
			throw new Error(`Unhandled message type: ${msg}`);
	}
}

export const Decoder = { decode };
