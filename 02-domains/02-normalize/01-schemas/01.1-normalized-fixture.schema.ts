// 02-domains/02-normalize/01-schemas/01.1-normalized-fixture.schema.ts
import { z } from 'zod';

export const NormalizedFixtureSchema = z.object({
	id: z.string(),                    // id consolidado (caliente-XXX o sm-YYY)
	leagueId: z.string(),
	leagueName: z.string(),
	leagueNameSource: z.string(),
	country: z.string(),
	homeOfficial: z.string(),
	awayOfficial: z.string(),
	home: z.string(),                  // normalizado (sin acentos)
	away: z.string(),
	dateUTC: z.string(),
	dateLocal: z.string(),
	odds: z.object({ home: z.number(), draw: z.number(), away: z.number() }),
	reference: z.object({
		sourceLeagueUrl: z.string().optional(),
		sourceFixtureUrl: z.string().optional()
	}).optional(),
	providers: z.array(z.string()),    // ['caliente','sportmonks']
		metrics: z.record(z.string(), z.number()).optional(), // xG, shotsOT, etc. cuando vengan de sportmonks
});

export type NormalizedFixtureDTO = z.infer<typeof NormalizedFixtureSchema>;
