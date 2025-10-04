// 02-domains/02-normalize/03-usecases/03.1-normalize.usecase.ts
import fs from 'fs';
import path from 'path';
import { loadConfig } from '../../../01-core/01-config/01.1-app.config';
import { createLogger } from '../../../01-core/02-logging/02.1-logger.service';
import type { RawFixture } from '../../../01-core/04-types/04.2-fixture.types';
import { NormalizedFixtureSchema, type NormalizedFixtureDTO } from '../01-schemas/01.1-normalized-fixture.schema';
import { mapCaliente, mapSportmonks } from '../02-mappers/02.1-normalize.mapper';

function readJsonArray<T>(filePath: string): T[] {
	return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T[];
}
function writeJson(filePath: string, obj: unknown) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function minutesDiff(aIso: string, bIso: string) {
	return Math.abs((new Date(aIso).getTime() - new Date(bIso).getTime()) / 60000);
}

export async function normalizeUsecase(params: {
	corridaId: string;
	inFile?: string;
	unifyThresholdMinutes?: number; // ± minutos para considerar el mismo partido
}) {
	const cfg = loadConfig();
	const log = createLogger(params.corridaId);
	const { root, rawDir, normalizedDir } = cfg.corridaPaths(params.corridaId);

	const inFile = params.inFile ?? path.join(rawDir, '01.1-fixtures.raw.json');
	const outFile = path.join(normalizedDir, '02.1-fixtures.normalized.json');
	const reportFile = path.join(normalizedDir, '02.2-report.json');

	if (!fs.existsSync(inFile)) throw new Error(`RAW no encontrado: ${inFile}`);

	log.info('Normalize | start', { inFile });

	const raw: RawFixture[] = readJsonArray<RawFixture>(inFile);
	const mapped: NormalizedFixtureDTO[] = [];

	for (const r of raw) {
		if (r.provider === 'caliente') {
			const n = mapCaliente(r, cfg.TIMEZONE);
			if (n) mapped.push(n);
		} else if (r.provider === 'sportmonks') {
			const n = mapSportmonks(r, cfg.TIMEZONE);
			if (n) mapped.push(n);
		}
	}

	// Unificar duplicados Caliente+SM: mismo leagueId, home/away normalizados y hora ±60'
	const THRESH = params.unifyThresholdMinutes ?? 60;
	const unified: NormalizedFixtureDTO[] = [];

	// índice para buscar por llave (leagueId + teams normalizados)
	const key = (x: NormalizedFixtureDTO) => `${x.leagueId}|${x.home}|${x.away}`;
	const bucket = new Map<string, NormalizedFixtureDTO[]>();
	for (const n of mapped) {
		const k = key(n);
		const arr = bucket.get(k) ?? [];
		arr.push(n);
		bucket.set(k, arr);
	}

	for (const arr of bucket.values()) {
		if (arr.length === 1) {
			unified.push(arr[0]);
			continue;
		}
		// prefer odds/hora/equipos de Caliente; complementar métricas de SM
		const cal = arr.find(a => a.providers.includes('caliente'));
		const sm  = arr.find(a => a.providers.includes('sportmonks'));

		if (cal && sm && minutesDiff(cal.dateUTC, sm.dateUTC) <= THRESH) {
			const merged: NormalizedFixtureDTO = {
				...cal,
				providers: Array.from(new Set([...(cal.providers||[]), ...(sm.providers||[])])),
				// si Sportmonks trae métricas, agrégalas
				metrics: { ...(cal.metrics||{}), ...(sm.metrics||{}) },
				// hora: mantiene la de Caliente por tu política
				// odds: mantiene las de Caliente por tu prioridad
			};
			unified.push(merged);
		} else {
			// no cumplen criterio de unificación → empujar cada uno
			unified.push(...arr);
		}
	}

	writeJson(outFile, unified);

	// Reporte: conteos + top 5 ligas
	const byLeague = new Map<string, number>();
	unified.forEach(f => byLeague.set(f.leagueName, (byLeague.get(f.leagueName) ?? 0) + 1));
	const topLeagues = Array.from(byLeague.entries())
		.sort((a,b) => b[1]-a[1])
		.slice(0,5)
		.map(([league, count]) => ({ league, count }));

	writeJson(reportFile, {
		corridaId: params.corridaId,
		totals: {
			rawIn: raw.length,
			normalized: unified.length
		},
		topLeagues
	});

	// Actualiza _meta.json con conteo normalized y endTime real
	try {
		const metaPath = path.join(root, '_meta.json');
		const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as any;
		meta.endTime = new Date().toISOString();
		meta.conteos.fixturesNormalized = unified.length;
		fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
	} catch {}

	log.info('Normalize | done', { normalized: unified.length, outFile, reportFile });
	return { count: unified.length, outFile, reportFile };
}
