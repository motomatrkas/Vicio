// 03-pipelines/02-run-all.ts
import { loadConfig } from '../01-core/01-config/01.1-app.config';
import { createLogger } from '../01-core/02-logging/02.1-logger.service';
import { jobIngest } from './01-jobs/01.1-01_ingest.job';
import { jobNormalize } from './01-jobs/01.2-02_normalize.job';
import { jobWeighting } from './01-jobs/01.3-03_weighting.job';
import { jobContext } from './01-jobs/01.4-04_context.job';

function parseArgs(argv: string[]) {
	const args: any = { mock: false, steps: 'ingest,normalize,weighting,context', from: 'caliente,sportmonks', minOdds: undefined };
	argv.forEach((a) => {
		if (a === '--mock') args.mock = true;
		if (a.startsWith('--steps=')) args.steps = a.split('=')[1];
		if (a.startsWith('--from=')) args.from = a.split('=')[1];
		if (a.startsWith('--minOdds=')) args.minOdds = Number(a.split('=')[1]);
	});
	return args;
}

async function main() {
	const cfg = loadConfig();
	const corridaId = cfg.makeCorridaId();
	const log = createLogger(corridaId);

	const { mock, steps, from, minOdds } = parseArgs(process.argv.slice(2));
	const stepsArr = steps.split(',').map((s: string) => s.trim());
	const sources = from.split(',').map((s: string) => s.trim());

	log.info('Run-all | start', { corridaId, steps: stepsArr, mock, sources, minOdds });

		if (stepsArr.includes('ingest'))   await jobIngest({ corridaId, mock, sources, minOdds });
		if (stepsArr.includes('normalize')) await jobNormalize({ corridaId });
		if (stepsArr.includes('weighting')) await jobWeighting({ corridaId });
		if (stepsArr.includes('context'))   await jobContext({ corridaId });

		log.info('Run-all | done', { corridaId });
}

main().catch((err) => {
	console.error('Fallo en pipeline:', err);
	process.exit(1);
});
