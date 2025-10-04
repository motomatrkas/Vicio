// 02-domains/01-ingest/00-config/01.ligas.caliente.ts
export type CalienteLeague = { leagueId: string; nombre: string; url: string; country: string };

export const LIGAS_CALIENTE: CalienteLeague[] = [
  { leagueId: 'ES_LALIGA', nombre: 'La Liga', url: 'https://sports.caliente.mx/es_MX/La-Liga?mkt_sort=AHRF', country: 'Spain' },
  { leagueId: 'ES_LALIGA2', nombre: 'La Liga 2', url: 'https://sports.caliente.mx/es_MX/t/48352/Segunda?mkt_sort=AHRF', country: 'Spain' },
  { leagueId: 'EN_EPL', nombre: 'Premier League', url: 'https://sports.caliente.mx/es_MX/Premier-League?mkt_sort=AHRF', country: 'England' },
  { leagueId: 'EN_CHAMP', nombre: 'Championship', url: 'https://sports.caliente.mx/es_MX/t/19156/Inglaterra-Championship?mkt_sort=AHRF', country: 'England' },
  { leagueId: 'EN_L1', nombre: 'League One', url: 'https://sports.caliente.mx/es_MX/t/19326/Inglaterra-League-One?mkt_sort=AHRF', country: 'England' },
  { leagueId: 'IT_SERIEA', nombre: 'Serie A', url: 'https://sports.caliente.mx/es_MX/Serie-A?mkt_sort=AHRF', country: 'Italy' },
  { leagueId: 'FR_L1', nombre: 'Ligue 1', url: 'https://sports.caliente.mx/es_MX/Ligue-1?mkt_sort=AHRF', country: 'France' },
  { leagueId: 'FR_L2', nombre: 'Ligue 2', url: 'https://sports.caliente.mx/es_MX/t/19405/Ligue-2?mkt_sort=AHRF', country: 'France' },
  { leagueId: 'DE_BUNDES', nombre: 'Bundesliga', url: 'https://sports.caliente.mx/es_MX/Bundesliga-1?mkt_sort=AHRF', country: 'Germany' },
  { leagueId: 'DE_2BUNDES', nombre: '2. Bundesliga', url: 'https://sports.caliente.mx/es_MX/t/19344/Bundesliga-2?mkt_sort=AHRF', country: 'Germany' },
  { leagueId: 'UEFA_UCL', nombre: 'Champions League', url: 'https://sports.caliente.mx/es_MX/t/61789/UEFA-Champions-League-Clasificatorios?mkt_sort=AHRF', country: 'UEFA' },
  { leagueId: 'MX_LIGAMX', nombre: 'Liga MX', url: 'https://sports.caliente.mx/es_MX/Liga-MX?mkt_sort=AHRF', country: 'Mexico' },
  { leagueId: 'US_MLS', nombre: 'MLS', url: 'https://sports.caliente.mx/es_MX/EE.UU-MLS?mkt_sort=AHRF', country: 'USA' },
  { leagueId: 'BR_SERIEA', nombre: 'Brasil Serie A', url: 'https://sports.caliente.mx/es_MX/t/19297/Brasil-Serie-A?mkt_sort=AHRF', country: 'Brazil' },
  { leagueId: 'AR_LPF', nombre: 'Argentina', url: 'https://sports.caliente.mx/es_MX/t/19296/Argentina-Liga-Profesional-de-F%C3%BAtbol?mkt_sort=AHRF', country: 'Argentina' },
  { leagueId: 'BE_JPL', nombre: 'Bélgica', url: 'https://sports.caliente.mx/es_MX/t/19372/Belgica-1ra-Divisi%C3%B3n-A?mkt_sort=AHRF', country: 'Belgium' },
  { leagueId: 'JP_JLEAGUE', nombre: 'J-League', url: 'https://sports.caliente.mx/es_MX/t/19378/Jap%C3%B3n-Liga-J?mkt_sort=AHRF', country: 'Japan' },
  { leagueId: 'KR_KLEAGUE', nombre: 'K-League', url: 'https://sports.caliente.mx/es_MX/t/19306/Corea-del-Sur-K-League-1?mkt_sort=AHRF', country: 'South Korea' },
  { leagueId: 'CN_CSL', nombre: 'Superliga China', url: 'https://sports.caliente.mx/es_MX/t/19485/China-Super-Liga?mkt_sort=AHRF', country: 'China' },
];
