// 01-core/01-config/01.2-env.schema.ts
import { z } from 'zod';

export const EnvSchema = z.object({
	// Ejecución/entorno
	NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
	LOG_LEVEL: z.enum(['silly', 'debug', 'info', 'warn', 'error']).default('debug'),

	// Localización
	TIMEZONE: z.string().default('America/Mexico_City'),
	LOCALE: z.string().default('es-MX'),

	// Paths
	DATA_DIR: z.string().default('04-artifacts'),

	// Moneda y reglas base de riesgo
	CURRENCY: z.string().default('MXN'),
	MIN_ODDS: z.coerce.number().default(1.5),          // No analizamos por debajo de esto
	MAX_STAKE_PCT: z.coerce.number().min(0).max(1).default(0.05), // 5% por pick (tu regla)
	DAILY_RISK_CAP_PCT: z.coerce.number().min(0).max(1).optional(), // opcional (sin tope si no se define)

	// Tiempos y resiliencia (según tus respuestas)
	REQUEST_TIMEOUT_MS: z.coerce.number().default(60000), // largo (45–60s)
	RETRY_MAX_ATTEMPTS: z.coerce.number().int().default(3),
	RETRY_BASE_MS: z.coerce.number().int().default(800),

	// Fuentes / features (arranque: Caliente + Sportmonks)
	FEATURE_SOURCES: z.string().default('caliente,sportmonks'),
	USE_KELLY: z.coerce.boolean().default(true),
	SAFE_MODE: z.coerce.boolean().default(false),
	DRY_RUN: z.coerce.boolean().default(false),

	// GUI/CLI (tú iniciarás por GUI)
	GUI_ENABLED: z.coerce.boolean().default(true),
	CLI_ENABLED: z.coerce.boolean().default(false),

	// Proxies (rotación con webshare.io)
	PROXY_PROVIDER: z.string().default('webshare'),
	PROXY_ROTATE: z.coerce.boolean().default(true),
	PROXY_URL_LIST: z.string().optional(), // lista separada por comas "http://user:pass@host:port,..."
	HTTP_PROXY: z.string().optional(),     // fallback único

	// Precisión numérica
	PROB_DECIMALS: z.coerce.number().int().default(4),
	STAKE_DECIMALS: z.coerce.number().int().default(2),
});

export type EnvVars = z.infer<typeof EnvSchema>;
