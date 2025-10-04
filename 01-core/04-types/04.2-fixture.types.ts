// 01-core/04-types/04.2-fixture.types.ts
import type { Odds, Market, Selection } from './04.1-odds.types';

export type RawFixture = {
	provider: 'caliente' | 'sportmonks';
	payload: any; // crudo del adaptador (se normaliza después)
};

export type NormalizedFixture = {
	id: string;
	league: string;
	home: string;
	away: string;
	date: string; // ISO
	odds: Odds;
	features?: Record<string, number>;
};

export type SimulationProbs = {
	fixtureId: string;
	pHome: number;
	pDraw: number;
	pAway: number;
};

export type Pick = {
	fixtureId: string;
	market: Market;     // '1X2'
	selection: Selection;
	prob: number;       // ya redondeada con 4 decimales
	price: number;      // decimal odds
	ev: number;
	stake: number;      // redondeada con 2 decimales
	notes?: string;
};
