import * as fs from 'fs';
import * as path from 'path';
import type { RawFixture } from '../../../01-core/04-types/04.2-fixture.types';

export async function fetchFromCaliente(opts: { mock: boolean }): Promise<RawFixture[]> {
	if (opts.mock) {
		const file = path.resolve(__dirname, '../../../06-tests/03-fixtures/03.2-sample-caliente.json');
		const data = JSON.parse(fs.readFileSync(file, 'utf8')) as any[];
		return data.map((payload) => ({ provider: 'caliente', payload }));
	}
	// TODO: implementar scraping real
	throw new Error('Caliente live-scrape no implementado aún');
}
