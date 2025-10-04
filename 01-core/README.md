# Core (núcleo compartido)

Incluye:
- **Config** (`01-config`): Carga `.env`, valida con Zod y expone helpers.
- **Logging** (`02-logging`): Winston con consola (siempre) y archivo por corrida.
- **Utils** (`03-utils`): Fecha/`corridaId` en `America/Mexico_City`, redondeos, retry con backoff+jitter.
- **Types** (`04-types`): Tipos base `Odds`, `Fixture`, `Pick`, etc.

## Convenciones que responden a tu estrategia
- **Locales**: `TIMEZONE=America/Mexico_City`, `LOCALE=es-MX`, `CURRENCY=MXN`.
- **Riesgo**: `MIN_ODDS=1.5` (no analizamos por debajo), `MAX_STAKE_PCT=0.05`.
- **Resiliencia**: `REQUEST_TIMEOUT_MS=60000`, `RETRY_MAX_ATTEMPTS=3`.
- **Ejecución**: prioridad **GUI** (`GUI_ENABLED=true`), CLI opcional.
- **Proxies**: rotación habilitable (`PROXY_ROTATE=true`, `PROXY_URL_LIST`).

## Uso rápido
```ts
import { loadConfig } from '../01-core/01-config/01.1-app.config';
import { createLogger } from '../01-core/02-logging/02.1-logger.service';
import { makeCorridaIdMx } from '../01-core/03-utils/03.1-date.utils';

const cfg = loadConfig();
const corridaId = cfg.makeCorridaId();
const logger = createLogger(corridaId);

logger.info('Arrancando corrida', { corridaId });
```
