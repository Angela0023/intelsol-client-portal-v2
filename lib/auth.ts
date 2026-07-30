// Simple authentication for client portal
// In production, use proper authentication (NextAuth.js, Auth0, etc.)

export type ClientAccess = 'admin' | 'xpose' | 'tslab' | 'beeit' | 'intelsol' | 'wulf' | 'peoplefocus' | 'plantryx' | 'demo';

export const CLIENT_PASSWORDS: Record<ClientAccess, string> = {
  admin: 'intelsol2026', // Matej + team access
  xpose: 'xpose2026',
  tslab: 'tslab2026',
  beeit: 'beeit2026',
  intelsol: 'intelsol2026',
  wulf: 'wulf2026',
  peoplefocus: 'peoplefocus2026',
  plantryx: 'plantryx2026',
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
    return ['admin', 'xpose', 'tslab', 'beeit', 'intelsol', 'wulf', 'peoplefocus', 'plantryx', 'demo'];
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
