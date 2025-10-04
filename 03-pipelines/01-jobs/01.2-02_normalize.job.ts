// 03-pipelines/01-jobs/01.2-02_normalize.job.ts
import { normalizeUsecase } from '../../02-domains/02-normalize/03-usecases/03.1-normalize.usecase';

export async function jobNormalize(opts: { corridaId: string; unifyThresholdMinutes?: number }) {
	return normalizeUsecase({ corridaId: opts.corridaId, unifyThresholdMinutes: opts.unifyThresholdMinutes ?? 60 });
}
