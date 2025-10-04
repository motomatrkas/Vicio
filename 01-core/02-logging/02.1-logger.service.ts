// 01-core/02-logging/02.1-logger.service.ts
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { loadConfig } from '../01-config/01.1-app.config';

const cfg = loadConfig();

/** Crea un logger con formato pretty en dev y JSON en prod. 
 *  Siempre consola; además, si pasas corridaId, también archivo.
 */
export function createLogger(corridaId?: string) {
	const consoleFormat = cfg.isDev
		? winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp(),
				winston.format.printf(({ level, message, timestamp, ...meta }) =>
					`[${timestamp}] ${level} ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
				)
			)
		: winston.format.json();

	const transports: winston.transport[] = [
		new winston.transports.Console({
			level: cfg.LOG_LEVEL,
			format: consoleFormat,
		}),
	];

	if (corridaId) {
		const { logsDir } = cfg.corridaPaths(corridaId);
		const filePath = path.join(logsDir, 'vicio.log');
		// Asegura el directorio (ya lo hace corridaPaths, pero doble seguro)
		fs.mkdirSync(logsDir, { recursive: true });
		transports.push(
			new winston.transports.File({
				filename: filePath,
				level: cfg.LOG_LEVEL,
				format: winston.format.json(),
			})
		);
	}

	const logger = winston.createLogger({
		level: cfg.LOG_LEVEL,
		defaultMeta: {
			app: 'vicio',
			env: cfg.NODE_ENV,
			tz: cfg.TIMEZONE,
			locale: cfg.LOCALE,
		},
		transports,
	});

	return logger;
}
