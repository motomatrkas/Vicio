// 02-domains/00-catalogs/01.leagues.catalog.ts
import { LIGAS_CALIENTE } from '../01-ingest/00-config/01.ligas.caliente';

export type LeagueCatalogItem = {
  leagueId: string;
  leagueName: string;
  aliases: string[];
  country: string;
};

export const LEAGUE_CATALOG: LeagueCatalogItem[] = LIGAS_CALIENTE.map(l => ({
  leagueId: l.leagueId,
  leagueName: l.nombre,
  aliases: [l.nombre],
  country: l.country,
}));

export function resolveLeague(nameFromSource: string): LeagueCatalogItem | null {
  const n = normalizeString(nameFromSource);
  for (const it of LEAGUE_CATALOG) {
    if (it.aliases.some(a => normalizeString(a) === n)) return it;
  }
  return null;
}

export function normalizeString(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}
