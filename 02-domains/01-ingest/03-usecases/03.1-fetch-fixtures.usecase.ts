// 02-domains/01-ingest/03-usecases/03.1-fetch-fixtures.usecase.ts
import * as fs from 'fs';
import * as path from 'path';
import { loadConfig } from '../../../01-core/01-config/01.1-app.config';
import { createLogger } from '../../../01-core/02-logging/02.1-logger.service';
import { withRetry } from '../../../01-core/03-utils/03.3-retry.utils';
import type { RawFixture } from '../../../01-core/04-types/04.2-fixture.types';
import { fetchFromCaliente } from '../01-adapters/01.1-caliente.adapter';
import { fetchFromSportmonks } from '../01-adapters/01.2-sportmonks.adapter';

function isSameLocalDay(dateIsoUtc: string, timeZone: string) {
	const d = new Date(dateIsoUtc);
	const fmt = new Intl.DateTimeFormat('en-CA', { timeZone, year:'numeric', month:'2-digit', day:'2-digit' });
	const today = fmt.format(new Date());
	const that  = fmt.format(d);
	return today === that;
}

function writeJson(filePath: string, obj: unknown) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

export async function fetchFixturesUsecase(params: {
	corridaId: string;
	mock?: boolean;
	sources?: string[]; // ['caliente','sportmonks']
	minOdds?: number;
}) {
	const cfg = loadConfig();
	const log = createLogger(params.corridaId);
	const sources = (params.sources ?? cfg.FEATURE_SOURCES.split(',')).map((s) => s.trim());
	const mock = !!params.mock;
	const minOdds = params.minOdds ?? cfg.MIN_ODDS;

	log.info('Ingest | start', { sources, mock, minOdds });

	const tasks: Promise<RawFixture[]>[] = [];

	if (sources.includes('caliente')) {
		tasks.push(withRetry(() => fetchFromCaliente({ mock }), {
			retries: cfg.RETRY_MAX_ATTEMPTS, baseMs: cfg.RETRY_BASE_MS, failFast: cfg.isDev
		}));
	}
	if (sources.includes('sportmonks')) {
		tasks.push(withRetry(() => fetchFromSportmonks({ mock }), {
			retries: cfg.RETRY_MAX_ATTEMPTS, baseMs: cfg.RETRY_BASE_MS, failFast: cfg.isDev
		}));
	}

	const all = (await Promise.all(tasks)).flat();

	// Filtro: solo hoy en TZ y MIN_ODDS desde ingest (ni se guardan RAW si no pasan)
	const filtered = all.filter((r) => {
		const dateIso = r.provider === 'caliente'
			? r.payload.date
			: r.payload.time?.starting_at?.date_time;

		if (!mock && (!dateIso || !isSameLocalDay(dateIso, cfg.TIMEZONE))) return false;

		// odds
		const odds = r.provider === 'caliente'
			? r.payload.odds
			: r.payload.odds?.['1X2'];

		if (!odds) return false;
		const trio = r.provider === 'caliente'
			? [odds.home, odds.draw, odds.away]
			: [odds['1'], odds['X'], odds['2']];

		if (trio.some((o) => typeof o !== 'number' || !isFinite(o) || o < minOdds)) return false;

		// status
		const status = (r.payload.status ?? 'scheduled').toLowerCase();
		if (status.includes('cancel') || status.includes('postpon')) return false;

		return true;
	});

	const { root, rawDir } = cfg.corridaPaths(params.corridaId);
	const outFile = path.join(rawDir, '01.1-fixtures.raw.json');

	writeJson(outFile, filtered);

	// meta
	const meta = {
		corridaId: params.corridaId,
		startTime: new Date().toISOString(),
		endTime: new Date().toISOString(),
		fuentes: sources,
		conteos: { fixturesRaw: filtered.length, fixturesNormalized: 0 }
	};
	writeJson(path.join(root, '_meta.json'), meta);

	log.info('Ingest | done', { count: filtered.length, outFile });
	return { count: filtered.length, outFile, metaPath: path.join(root, '_meta.json') };
}
