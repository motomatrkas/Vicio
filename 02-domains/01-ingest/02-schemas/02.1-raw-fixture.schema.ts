// 02-domains/01-ingest/02-schemas/02.1-raw-fixture.schema.ts
import { z } from 'zod';

export const RawCalienteSchema = z.object({
	sourceId: z.string(),
	league: z.string(),
	home: z.string(),
	away: z.string(),
	date: z.string(), // ISO UTC
	odds: z.object({ home: z.number(), draw: z.number(), away: z.number() }),
	status: z.string().optional(), // scheduled|postponed|canceled...
	link: z.string().optional()
});

export const RawSportmonksSchema = z.object({
	fixture_id: z.number(),
	league: z.object({ name: z.string() }),
	localteam: z.object({ name: z.string() }),
	visitorteam: z.object({ name: z.string() }),
	time: z.object({ starting_at: z.object({ date_time: z.string() }) }),
	odds: z.object({ '1X2': z.object({ '1': z.number(), X: z.number(), '2': z.number() }) }).optional(),
	status: z.string().optional()
});
