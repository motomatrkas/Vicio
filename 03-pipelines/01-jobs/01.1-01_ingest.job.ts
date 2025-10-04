// 03-pipelines/01-jobs/01.1-01_ingest.job.ts
import { fetchFixturesUsecase } from '../../02-domains/01-ingest/03-usecases/03.1-fetch-fixtures.usecase';

export async function jobIngest(opts: {
	corridaId: string;
	mock: boolean;
	sources?: string[];
	minOdds?: number;
}) {
	return fetchFixturesUsecase({ corridaId: opts.corridaId, mock: opts.mock, sources: opts.sources, minOdds: opts.minOdds });
}
