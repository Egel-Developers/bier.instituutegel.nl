export type Rating = {
	username: string;
	beer: string;
	rating: number;
};

export type Ranking = {
	beer: string;
	rating: number;
	count: number;
}[];

export type SocketData = {
	type: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
};

export const unflattenRanking = (ranking: (string | number)[]) => {
	if (ranking.length % 3 !== 0) throw new Error('WTF??');

	const result: Ranking = [];
	for (let i = 0; i < ranking.length; i += 3)
		result.push({
			beer: ranking[i] as string,
			rating: ranking[i + 1] as number,
			count: ranking[i + 2] as number
		});
	return result;
};
