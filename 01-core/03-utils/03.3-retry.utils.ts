// 01-core/03-utils/03.3-retry.utils.ts
import { setTimeout as sleep } from 'timers/promises';

export type RetryOptions = {
	retries?: number;           // intentos totales (incluye el primero fallido)
	baseMs?: number;            // backoff base
	factor?: number;            // multiplicador exponencial
	jitter?: boolean;           // ruido aleatorio para evitar sincronización
	failFast?: boolean;         // si true, lanza sin reintentos (útil en dev)
};

export async function withRetry<T>(
	fn: () => Promise<T>,
	opts: RetryOptions = {}
): Promise<T> {
	const {
		retries = 3,
		baseMs = 800,
		factor = 2,
		jitter = true,
		failFast = false,
	} = opts;

	if (failFast) return fn();

	let attempt = 0;
	let lastErr: any;
	while (attempt < retries) {
		try {
			return await fn();
		} catch (err) {
			lastErr = err;
			attempt++;
			if (attempt >= retries) break;
			const delay = computeDelay(baseMs, factor, attempt, jitter);
			await sleep(delay);
		}
	}
	throw lastErr;
}

function computeDelay(baseMs: number, factor: number, attempt: number, jitter: boolean) {
	const raw = baseMs * Math.pow(factor, attempt - 1);
	if (!jitter) return raw;
	const noise = Math.random() * raw * 0.25; // ±25%
	return Math.max(50, raw - noise);
}
