// 01-core/03-utils/03.2-math.utils.ts

/** Redondeos consistentes con tus reglas */
export function roundProb(x: number, decimals = 4) {
	return Number.parseFloat(x.toFixed(decimals));
}
export function roundStake(x: number, decimals = 2) {
	return Number.parseFloat(x.toFixed(decimals));
}

/** Odds: decimal -> americano */
export function decimalToAmerican(decimal: number): number {
	if (decimal <= 1.0) throw new Error('Decimal odds must be > 1.0');
	return decimal >= 2 ? Math.round((decimal - 1) * 100) : Math.round(-100 / (decimal - 1));
}

/** Odds: americano -> decimal */
export function americanToDecimal(american: number): number {
	return american > 0 ? 1 + american / 100 : 1 + 100 / Math.abs(american);
}

/** EV básico: prob * (price-1) - (1-prob) (solo referencia matemática, sin política de stake) */
export function expectedValue(prob: number, price: number) {
	return prob * (price - 1) - (1 - prob);
}

/** Kelly fraccional (devuelve fracción del bankroll; f en 0..1) */
export function kellyFraction(prob: number, price: number, fraction: number = 0.25) {
	const b = price - 1;
	const fStar = (b * prob - (1 - prob)) / b;
	const f = Math.max(0, fStar) * fraction;
	return isFinite(f) ? Math.max(0, f) : 0;
}
