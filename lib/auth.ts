// Simple authentication for client portal
// In production, use proper authentication (NextAuth.js, Auth0, etc.)

export type ClientAccess = 'admin' | 'xpose' | 'tslab' | 'beeit' | 'intelsol' | 'wulf' | 'peoplefocus' | 'plantryx' | 'adsigner' | 'mountaindrop' | 'eblissai' | 'zen2fit' | 'demo';

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
  demo: 'demo2026', // Demo dashboard for presentations
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
    return ['admin', 'xpose', 'tslab', 'beeit', 'intelsol', 'wulf', 'peoplefocus', 'plantryx', 'adsigner', 'mountaindrop', 'eblissai', 'zen2fit', 'demo'];
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
