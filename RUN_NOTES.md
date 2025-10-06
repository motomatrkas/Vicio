### Scripts disponibles

| Script         | Descripción                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `run:wctx`     | Corrida corta: `ingest,normalize,weighting,context` en **mock**            |
| `run:full`     | Pipeline completo en **mock**: incluye simulación, validación, decisión     |
| `run:sim`      | Solo `simulation,validation,decision,export` (útil para iterar modelos)     |

**Ejemplos:**
```bash
npm run run:wctx
npm run run:full
npm run run:sim
```

# RUN_NOTES.md

## Comando de ejecución del pipeline

### Comando npm recomendado
npm run run:wctx

### Comando completo (todos los pasos)
```bash
ts-node 03-pipelines/02-run-all.ts \
  --steps=ingest,normalize,weighting,context,simulation,validation,decision,export \
  --from=caliente,sportmonks --minOdds=1.5 --mock \
  --sims=10000 --sigma=0.25 --ah=-0.25,-0.5,-1.0
```

---

## Validación rápida de configuración (sin tocar `tsconfig`)

Para evitar errores al usar `import('./*.ts')` en una línea (TS5097), usar **require() (CommonJS)**:

```powershell
# (Opcional) Exportar variables mínimas en esta sesión
$env:NODE_ENV="dev"; $env:LOG_LEVEL="debug"; $env:TIMEZONE="America/Mexico_City";
$env:LOCALE="es-MX"; $env:DATA_DIR="04-artifacts"; $env:CURRENCY="MXN";
$env:MIN_ODDS="1.5"; $env:MAX_STAKE_PCT="0.05"; $env:REQUEST_TIMEOUT_MS="60000";
$env:RETRY_MAX_ATTEMPTS="3"; $env:FEATURE_SOURCES="caliente,sportmonks";
$env:USE_KELLY="true"; $env:SAFE_MODE="true"; $env:DRY_RUN="true";

npx ts-node -e "const { loadConfig } = require('./01-core/01-config/01.1-app.config'); const c = loadConfig(); console.log(JSON.stringify({ NODE_ENV:c.NODE_ENV, TIMEZONE:c.TIMEZONE, LOCALE:c.LOCALE, DATA_DIR:c.DATA_DIR, CURRENCY:c.CURRENCY, MIN_ODDS:c.MIN_ODDS, MAX_STAKE_PCT:c.MAX_STAKE_PCT, REQUEST_TIMEOUT_MS:c.REQUEST_TIMEOUT_MS, RETRY_MAX_ATTEMPTS:c.RETRY_MAX_ATTEMPTS, FEATURE_SOURCES:c.FEATURE_SOURCES, USE_KELLY:c.USE_KELLY, SAFE_MODE:c.SAFE_MODE, DRY_RUN:c.DRY_RUN, LOG_LEVEL:c.LOG_LEVEL }, null, 2));"
```

> Cuando pases a **live**, recuerda desactivar los flags de simulación:
> `SAFE_MODE=false` y `DRY_RUN=false`.

Puedes personalizar los pasos con el flag --steps=...

## Módulos y jobs agregados recientemente

- simulation: Monte Carlo y Poisson (servicios y usecase)
- validation: validación de probabilidades y lambdas
- decision: cálculo de picks, EV y Kelly
- export: copia picks a latest/
- Todos los jobs agregados a 03-pipelines/01-jobs/
- El runner 02-run-all.ts ahora ejecuta toda la pipeline de ingest a export

## Errores recientes corregidos por el agente de VSCode

- Problemas de import/export en adapters y usecases (exportación de funciones como módulos).
- Error de zod: uso incorrecto de z.record(z.number()) en vez de z.record(z.string(), z.number()).
- Faltaba instalar la dependencia yaml y sus tipos para parsear archivos YAML.
- Corrección de rutas relativas y argumentos en scripts de package.json.
- Se agregó latestDir a corridaPaths en config para soportar exportación.
- Se corrigieron rutas y argumentos en el runner para soportar todos los pasos y flags.

## Cambios recientes (oct 2025)

- El job de ingest (`03-pipelines/01-jobs/01.1-01_ingest.job.ts`) ahora expone la función `jobIngest` con flags `{ corridaId, sources, minOdds?, mock? }` y llama internamente a `fetchFixturesUsecase`.
- Se agregó a `.env.example` la variable `WEBSHARE_PROXIES` para proxies rotativos de Webshare:
  ```
  #  Proxies de Webshare: coma-separados. Ej:
  #  WEBSHARE_PROXIES=http://user:pass@proxy1:port,http://user:pass@proxy2:port
  WEBSHARE_PROXIES=
  ```
- Corrección de exports en adapters y usecases (`scrapeCalienteTodayAdapter` y otros) para evitar errores de importación.
- Se agregó `latestDir` al tipo de retorno de `corridaPaths` en config para soportar la exportación de picks.
- El proyecto compila correctamente (`npx tsc --noEmit` sin errores).
- El job de validación (`03-pipelines/01-jobs/01.6-06_validation.job.ts`) apunta al nuevo usecase y reporte detallado en `validationDir` (`05.1-report.json`). No requiere cambios funcionales, solo asegura integración con la política de reporte y _meta.json.
- El cap global de stake para Kelly (`risk.MAX_STAKE_PCT`) ya está disponible en la configuración central (`01-core/01-config/01.1-app.config.ts`), con default 0.05 (5%). Se puede ajustar vía variable de entorno `MAX_STAKE_PCT` y es usado automáticamente en la decisión de picks.

## Observaciones y cambios recientes (oct 2025, agente VSCode)

- Se migró el pipeline de exportación a una estructura modular avanzada:
  - Servicios: summary, archive, uploader, bankroll (`02-domains/08-export/01-services/`)
  - Usecase principal: `02.1-export.usecase.ts` (exporta, resume, archiva, sube y limpia)
  - Job único: `01.8-08_export.job.ts` (sin duplicados, solo la versión modular)
- El runner `02-run-all.ts` ahora:
  - Cronometra cada paso y el total, actualiza status/timing en `_meta.json`.
  - Pasa flags avanzados a export (`withBankroll`, `uploadTarget`).
  - Permite control granular por flags y pasos.
- Scripts de `package.json` actualizados:
  - `run:full`: pipeline completo con export avanzado y flags de upload/bankroll.
  - `run:export`: solo exportación avanzada.
- `.env.example` ampliado:
  - Incluye variables para upload/export: `EXPORT_UPLOAD_TARGET`, `GITHUB_TOKEN`, `SUPABASE_URL`, `AWS_ACCESS_KEY_ID`, etc.
- Se corrigieron duplicados y errores de redeclaración en jobs.
- Validación de configuración (`loadConfig`) y pipeline modular funcionan correctamente.
- No se detectan errores de lógica, integración ni sintaxis en los módulos recientes.
- El pipeline es robusto, modular y listo para pruebas end-to-end o integración de upload real.

## GUI (Electron + React + Tailwind)

- Scripts útiles agregados en package.json:
  - `gui:dev`: ejecuta la app Electron en modo desarrollo (`npm run gui:dev`).
  - `gui:build`: compila TypeScript y construye el paquete con electron-builder (`npm run gui:build`).
- Dependencias instaladas:
  - `react`, `react-dom`, `@types/react`, `@types/react-dom`, `electron`, `@types/electron`.
- Estructura creada:
  - `05-apps/02-gui/02.1-main.ts`: proceso principal Electron + IPC.
  - `05-apps/02-gui/preload.ts`: API segura expuesta al renderer.
  - `05-apps/02-gui/02.2-App.tsx`: UI React con Tailwind, dark theme, picks, performance y settings.
  - `05-apps/02-gui/index.html`: renderer básico para React (ajustable para Vite/build moderno).
- El tsconfig soporta JSX moderno (`jsx: react-jsx`).
- Listo para desarrollo y build de la GUI.

---
