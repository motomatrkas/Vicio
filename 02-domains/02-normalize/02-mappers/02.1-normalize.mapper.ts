// 02-domains/02-normalize/02-mappers/02.1-normalize.mapper.ts
import { RawCalienteSchema, RawSportmonksSchema } from '../../01-ingest/02-schemas/02.1-raw-fixture.schema';
import type { RawFixture } from '../../../01-core/04-types/04.2-fixture.types';
import { normalizeString } from '../../00-catalogs/01.leagues.catalog';
import { isoInTz } from '../../../01-core/03-utils/03.1-date.utils';
import { resolveLeague } from '../../00-catalogs/01.leagues.catalog';

export function mapCaliente(raw: RawFixture, tz: string) {
	const v = RawCalienteSchema.safeParse(raw.payload);
	if (!v.success) return null;
	const p = v.data;
	const league = resolveLeague(p.league);
	if (!league) return null;

	const homeOfficial = p.home;
	const awayOfficial = p.away;

	return {
		id: `caliente-${p.sourceId}`,
		leagueId: league.leagueId,
		leagueName: league.leagueName,
		leagueNameSource: p.league,
		country: league.country,
		homeOfficial,
		awayOfficial,
		home: normalizeString(homeOfficial),
		away: normalizeString(awayOfficial),
		dateUTC: p.date,
		dateLocal: isoInTz(new Date(p.date), tz),
		odds: p.odds,
		reference: { sourceLeagueUrl: undefined, sourceFixtureUrl: p.link },
		providers: ['caliente'],
		metrics: {}
	};
}

export function mapSportmonks(raw: RawFixture, tz: string) {
	const v = RawSportmonksSchema.safeParse(raw.payload);
	if (!v.success) return null;
	const p = v.data;
	const league = resolveLeague(p.league.name);
	if (!league) return null;

	const homeOfficial = p.localteam.name;
	const awayOfficial = p.visitorteam.name;

	return {
		id: `sm-${p.fixture_id}`,
		leagueId: league.leagueId,
		leagueName: league.leagueName,
		leagueNameSource: p.league.name,
		country: league.country,
		homeOfficial,
		awayOfficial,
		home: normalizeString(homeOfficial),
		away: normalizeString(awayOfficial),
		dateUTC: p.time.starting_at.date_time,
		dateLocal: isoInTz(new Date(p.time.starting_at.date_time), tz),
		odds: p.odds ? { home: p.odds['1X2']['1'], draw: p.odds['1X2']['X'], away: p.odds['1X2']['2'] } : { home: NaN, draw: NaN, away: NaN },
		reference: {},
		providers: ['sportmonks'],
		metrics: {} // aquí enchufarás xG, etc. cuando vengan
	};
}
