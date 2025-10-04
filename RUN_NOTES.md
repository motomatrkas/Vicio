# RUN_NOTES.md

## Comando de ejecución del pipeline

npm run run:wctx

# O directamente:
ts-node 03-pipelines/02-run-all.ts --steps=ingest,normalize,weighting,context --from=caliente,sportmonks --minOdds=1.5 --mock

## Errores recientes corregidos por el agente de VSCode

- Problemas de import/export en adapters y usecases (exportación de funciones como módulos).
- Error de zod: uso incorrecto de z.record(z.number()) en vez de z.record(z.string(), z.number()).
- Faltaba instalar la dependencia yaml y sus tipos para parsear archivos YAML.
- Corrección de rutas relativas y argumentos en scripts de package.json.

## Partes frágiles o que pueden fallar

- El pipeline depende de la estructura y nombres de archivos generados; si cambian, pueden romperse los imports.
- Si falta algún archivo de configuración (YAML, JSON), el pipeline lanza error y no continúa.
- La validación de tipos y esquemas es estricta: si los datos de entrada no cumplen, se filtran o fallan silenciosamente.
- El manejo de features y métricas depende de la presencia de datos en los fixtures normalizados; si no hay métricas, los scores pueden ser poco confiables.
- El script asume que todos los directorios existen o pueden crearse; si hay permisos restringidos, puede fallar la escritura.
