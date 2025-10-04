// 02-domains/03-weighting/02-usecases/02.1-apply-weights.usecase.ts
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { loadConfig } from '../../../01-core/01-config/01.1-app.config';
import { createLogger } from '../../../01-core/02-logging/02.1-logger.service';
import { NormalizedFixtureSchema, type NormalizedFixtureDTO } from '../../02-normalize/01-schemas/01.1-normalized-fixture.schema';
import { roundProb } from '../../../01-core/03-utils/03.2-math.utils';

// ...existing code...

export async function applyWeightsUsecase(params: { corridaId: string }) {
  // ...existing code...
}
