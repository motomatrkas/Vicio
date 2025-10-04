// 01-core/04-types/04.1-odds.types.ts
export type Odds = {
	home: number; // decimal odds
	draw: number;
	away: number;
};

export type Market = '1X2';
export type Selection = 'HOME' | 'DRAW' | 'AWAY';
