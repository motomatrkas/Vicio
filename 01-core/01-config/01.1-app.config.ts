// 01-core/01-config/01.1-app.config.ts
import 'dotenv/config';
import * as path from 'path';
import * as fs from 'fs';
import { EnvSchema, type EnvVars } from './01.2-env.schema';
import { makeCorridaIdMx } from '../03-utils/03.1-date.utils';

export type AppConfig = EnvVars & {
	isDev: boolean;
	isProd: boolean;
	/** Genera un corridaId yyyyMMdd-HHmmss en TZ configurada */
	makeCorridaId: () => string;
	/** Devuelve paths derivados para una corrida */
	corridaPaths: (corridaId: string) => {
		root: string;
		logsDir: string;
		rawDir: string;
		normalizedDir: string;
		featuresDir: string;
		simulationsDir: string;
		validationDir: string;
		picksDir: string;
	};
};

/** Carga .env, valida con Zod y expone helpers coherentes con tu flujo */
export function loadConfig(): AppConfig {
	const parsed = EnvSchema.parse(process.env);
	const isDev = parsed.NODE_ENV === 'dev';
	const isProd = !isDev;

	const makeCorridaId = () => makeCorridaIdMx(parsed.TIMEZONE);

	const corridaPaths = (corridaId: string) => {
		const root = path.resolve(parsed.DATA_DIR, corridaId);
		const p = {
			root,
			logsDir: path.join(root, '_logs'),
			rawDir: path.join(root, '01-raw'),
			normalizedDir: path.join(root, '02-normalized'),
			featuresDir: path.join(root, '03-features'),
			simulationsDir: path.join(root, '04-simulations'),
			validationDir: path.join(root, '05-validation'),
			picksDir: path.join(root, '06-picks'),
		};
		// Nos aseguramos de crear directorios base al momento de configurar
		[p.root, p.logsDir, p.rawDir, p.normalizedDir, p.featuresDir, p.simulationsDir, p.validationDir, p.picksDir]
			.forEach((d) => fs.mkdirSync(d, { recursive: true }));
		return p;
	};

	return { ...(parsed as EnvVars), isDev, isProd, makeCorridaId, corridaPaths };
}
