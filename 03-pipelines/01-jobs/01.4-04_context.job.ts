// 03-pipelines/01-jobs/01.4-04_context.job.ts
import { applyContextUsecase } from '../../02-domains/04-context/02-usecases/02.1-apply-context.usecase';

export async function jobContext(opts: { corridaId: string }) {
  return applyContextUsecase({ corridaId: opts.corridaId });
}
