// 01-core/03-utils/03.1-date.utils.ts

/** Retorna YYYYMMDD-HHmmss usando Intl en la zona horaria dada */
export function makeCorridaIdMx(timeZone: string = 'America/Mexico_City'): string {
	const d = new Date();
	const parts = toParts(d, timeZone);
	return `${parts.y}${parts.m}${parts.d}-${parts.hh}${parts.mm}${parts.ss}`;
}

/** ISO local (con TZ) útil para artefactos o logs */
export function isoInTz(date = new Date(), timeZone = 'America/Mexico_City') {
	const parts = toParts(date, timeZone);
	return `${parts.y}-${parts.m}-${parts.d}T${parts.hh}:${parts.mm}:${parts.ss}${offsetForTz(timeZone)}`;
}

// ---------- helpers ----------
function toParts(d: Date, timeZone: string) {
	const dtf = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});
	const get = (t: Intl.DateTimeFormatPartTypes) =>
		dtf.formatToParts(d).find((p) => p.type === t)?.value ?? '';
	return {
		y: get('year'),
		m: get('month'),
		d: get('day'),
		hh: get('hour'),
		mm: get('minute'),
		ss: get('second'),
	};
}

/** Best effort para imprimir offset del timezone como +HH:MM (esto no cambia la hora) */
function offsetForTz(_tz: string): string {
	// Nota: obtener el offset exacto por TZ sin libs es complejo.
	// Esto devuelve el offset actual de la máquina en formato ±HH:MM.
	const offMin = -new Date().getTimezoneOffset();
	const sign = offMin >= 0 ? '+' : '-';
	const abs = Math.abs(offMin);
	const hh = String(Math.floor(abs / 60)).padStart(2, '0');
	const mm = String(abs % 60).padStart(2, '0');
	return `${sign}${hh}:${mm}`;
}
