import { serverState } from './ranking.svelte';
import type {
	Beer,
	CodeAccServerMessage,
	CodeReqServerMessage,
	InitialServerMessage,
	Rating,
	RatingServerMessage,
	ServerMessage,
	User,
	UsernameAccServerMessage,
	UsernameReqServerMessage
} from './types';

function decodeInitial(buf: Uint8Array): InitialServerMessage {
	const decoder = new TextDecoder();
	let offset = 0;

	// 1. message_type
	const messageType = buf[offset++];
	if (messageType !== 0) {
		throw new Error(`Expected messageType 0, got ${messageType}`);
	}

	// 2. users
	const userCount = buf[offset++];
	const users: User[] = [];
	for (let i = 0; i < userCount; i++) {
		const nameLength = buf[offset++];
		const nameBytes = buf.slice(offset, offset + nameLength);
		const name = decoder.decode(nameBytes);
		users.push({ id: i + 1, name });
		offset += nameLength;
	}

	// 3. beers
	const beerCount = buf[offset++];
	const beers: Beer[] = [];
	for (let i = 0; i < beerCount; i++) {
		const nameLength = buf[offset++];
		const nameBytes = buf.slice(offset, offset + nameLength);
		const beerName = decoder.decode(nameBytes);
		beers.push({ id: i + 1, name: beerName });
		offset += nameLength;
	}

	// 4. ratings
	const ratingCount = (buf[offset++] << 8) | buf[offset++];
	const ratings: Rating[] = [];
	for (let i = 0; i < ratingCount; i++) {
		const user_id = buf[offset++];
		const beer_id = buf[offset++];
		const rating = buf[offset++];
		ratings.push({ user_id, beer_id, rating });
	}

	return {
		messageType: 0,
		users,
		beers,
		ratings
	};
}

function decodeCodeReq(): CodeReqServerMessage {
	return { messageType: 1 };
}

function decodeCodeAcc(): CodeAccServerMessage {
	return { messageType: 2 };
	// return JSON.parse(msg);
}

function decodeUsernameReq(): UsernameReqServerMessage {
	return { messageType: 3 };
	// return JSON.parse(msg);
}

function decodeUsernameAcc(buf: Uint8Array): UsernameAccServerMessage {
	return {
		messageType: 4,
		user_id: buf[1]
	};
	// return JSON.parse(msg);
}

function decodeRating(buf: Uint8Array): RatingServerMessage {
	const decoder = new TextDecoder();
	let offset = 0;

	const messageType = buf[offset++];
	if (messageType !== 5) throw new Error('Expected messageType 5');

	const rating = buf[offset++];
	const beer_id = buf[offset++];
	const user_id = buf[offset++];

	let username: string | undefined;
	let beer: string | undefined;

	// Conditionally decode username if this user_id is new
	if (!serverState.users.has(user_id)) {
		const usernameLength = buf[offset++];
		if (usernameLength < 3 || usernameLength > 32) {
			throw new Error('Invalid username length');
		}
		const usernameBytes = buf.slice(offset, offset + usernameLength);
		username = decoder.decode(usernameBytes);
		offset += usernameLength;
	}

	// Conditionally decode beer if this beer_id is new
	if (!serverState.beers.has(beer_id)) {
		const beerLength = buf[offset++];
		if (beerLength < 3 || beerLength > 32) {
			throw new Error('Invalid beer name length');
		}
		const beerBytes = buf.slice(offset, offset + beerLength);
		beer = decoder.decode(beerBytes);
		offset += beerLength;
	}

	return {
		messageType: 5,
		rating,
		beer_id,
		user_id,
		username,
		beer
	};
	// return JSON.parse(msg);
}

function decode(msg: ArrayBuffer): ServerMessage {
	// TODO look at first byte
	// const { messageType } = typeof msg === 'string' ? JSON.parse(msg) : { messageType: msg.at(0) };
	const buf = new Uint8Array(msg);
	const messageType = buf.at(0);

	switch (messageType) {
		case 0:
			return decodeInitial(buf);
		case 1:
			return decodeCodeReq();
		case 2:
			return decodeCodeAcc();
		case 3:
			return decodeUsernameReq();
		case 4:
			return decodeUsernameAcc(buf);
		case 5:
			return decodeRating(buf);
		default:
			throw new Error(`Unhandled message type: ${messageType}`);
	}
}

export const Decoder = { decode };
