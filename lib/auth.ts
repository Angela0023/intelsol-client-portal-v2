// Simple authentication for client portal
// In production, use proper authentication (NextAuth.js, Auth0, etc.)

export type ClientAccess = 'admin' | 'xpose' | 'tslab' | 'beeit' | 'intelsol' | 'wulf' | 'peoplefocus' | 'plantryx' | 'adsigner' | 'mountaindrop' | 'eblissai' | 'zen2fit' | 'panorate' | 'mbedtronix' | 'clevercraft' | 'stojkov' | 'birografika' | 'bmevents' | 'prtronic' | 'dhm' | 'morefromfood' | 'pacia' | 'selekcija' | 'intera' | 'seyens' | 'integraplast' | 'askit' | 'dukegroup' | 'novavizija' | 'demo';

export type Assignee = 'Frosina' | 'Matej' | 'Filip';

export const CLIENT_PASSWORDS: Record<ClientAccess, string> = {
  admin: 'Portal.Master.24', // Matej + team access
  xpose: 'Beauty.Leads.47',
  tslab: 'Capsule.Supply.29',
  beeit: 'Agency.Track.56',
  intelsol: 'Portal.Master.24',
  wulf: 'Mountain.Path.83',
  peoplefocus: 'Talent.Team.91',
  plantryx: 'plantryx2026',
  adsigner: 'Email.Brand.42',
  mountaindrop: 'Mountain.Resin.38',
  eblissai: 'AI.Endpoint.65',
  zen2fit: 'Wellness.Tech.52',
  panorate: 'Visual.Machine.73',
  mbedtronix: 'Embedded.Serbia.2026',
  clevercraft: 'Partner.Flow.2026',
  stojkov: 'Print.Box.Serbia.2026',
  birografika: 'Label.Print.Serbia.2026',
  bmevents: 'Promo.Events.Slovenia.2026',
  prtronic: 'Display.Solutions.DACH.2026',
  dhm: 'HACCP.Food.Slovenia.2026',
  morefromfood: 'Food.Quality.Croatia.2026',
  pacia: 'PACIA.Leads.34',
  selekcija: 'Psychometric.Slovenia.2026',
  intera: 'CRM.Croatia.Serbia.2026',
  seyens: 'Seyens.Science.Viz.2026',
  integraplast: 'Integraplast.Injection.2026',
  askit: 'ASKIT.Leads.42',
  dukegroup: 'DukeGroup.Leads.67',
  novavizija: 'ProPIS.ERP.Croatia.2026',
  demo: 'demo2026', // Demo dashboard for presentations
};

export const CLIENT_ASSIGNEES: Record<ClientAccess, Assignee | null> = {
  admin: null,
  xpose: 'Frosina',
  tslab: 'Matej',
  beeit: 'Filip',
  intelsol: 'Matej',
  wulf: 'Frosina',
  peoplefocus: 'Filip',
  plantryx: 'Matej',
  adsigner: 'Frosina',
  mountaindrop: 'Filip',
  eblissai: 'Matej',
  zen2fit: 'Frosina',
  panorate: 'Filip',
  mbedtronix: 'Matej',
  clevercraft: 'Frosina',
  stojkov: 'Filip',
  birografika: 'Matej',
  bmevents: 'Frosina',
  prtronic: 'Filip',
  dhm: 'Matej',
  morefromfood: 'Frosina',
  pacia: 'Filip',
  selekcija: 'Filip',
  intera: 'Matej',
  seyens: 'Frosina',
  integraplast: 'Frosina',
  askit: 'Filip',
  dukegroup: 'Frosina',
  novavizija: 'Frosina',
  demo: null,
};

export function validateAccess(client: ClientAccess, password: string): boolean {
  return CLIENT_PASSWORDS[client] === password;
}

export function checkAdminAccess(password: string): boolean {
  return CLIENT_PASSWORDS.admin === password;
}

export function getAllowedClients(password: string): ClientAccess[] {
  // Admin can access all
  if (checkAdminAccess(password)) {
    return ['admin', 'xpose', 'tslab', 'beeit', 'intelsol', 'wulf', 'peoplefocus', 'plantryx', 'adsigner', 'mountaindrop', 'eblissai', 'zen2fit', 'panorate', 'mbedtronix', 'clevercraft', 'stojkov', 'birografika', 'bmevents', 'prtronic', 'dhm', 'morefromfood', 'pacia', 'selekcija', 'intera', 'seyens', 'integraplast', 'askit', 'dukegroup', 'novavizija', 'demo'];
  }

  // Check individual client access
  const allowed: ClientAccess[] = [];
  (Object.keys(CLIENT_PASSWORDS) as ClientAccess[]).forEach((client) => {
    if (validateAccess(client, password)) {
      allowed.push(client);
    }
  });

  return allowed;
}

export function getClientAssignee(clientId: ClientAccess): Assignee | null {
  return CLIENT_ASSIGNEES[clientId];
}
