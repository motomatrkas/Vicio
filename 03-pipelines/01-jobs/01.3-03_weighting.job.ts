// 03-pipelines/01-jobs/01.3-03_weighting.job.ts
import { applyWeightsUsecase } from '../../02-domains/03-weighting/02-usecases/02.1-apply-weights.usecase';

export async function jobWeighting(opts: { corridaId: string }) {
  return applyWeightsUsecase({ corridaId: opts.corridaId });
}
