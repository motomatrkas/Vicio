import * as fs from 'fs';
import * as path from 'path';
import type { RawFixture } from '../../../01-core/04-types/04.2-fixture.types';

export async function fetchFromSportmonks(opts: { mock: boolean }): Promise<RawFixture[]> {
	if (opts.mock) {
		const file = path.resolve(__dirname, '../../../06-tests/03-fixtures/03.3-sample-sportmonks.json');
		const data = JSON.parse(fs.readFileSync(file, 'utf8')) as any[];
		return data.map((payload) => ({ provider: 'sportmonks', payload }));
	}
	// TODO: implementar API real
	throw new Error('Sportmonks live-api no implementado aún');
}
