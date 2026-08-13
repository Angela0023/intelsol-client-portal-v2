'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BarChart3, Users, Building2 } from 'lucide-react';

interface SidebarProps {
  clientAccess: string[];
}

export default function Sidebar({ clientAccess }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = clientAccess.includes('admin');

  const clients = [
    { id: 'demo', name: 'Demo (Sample)', icon: Building2, color: 'text-cyan-600' },
    { id: 'xpose', name: 'Xpose Solutions', icon: Building2, color: 'text-blue-600' },
    { id: 'tslab', name: 'TS Lab', icon: Building2, color: 'text-green-600' },
    { id: 'adsigner', name: 'AdSigner', icon: Building2, color: 'text-teal-600' },
    { id: 'beeit', name: 'BeeIt', icon: Building2, color: 'text-amber-600' },
    { id: 'intelsol', name: 'Intelsol', icon: Building2, color: 'text-violet-600' },
    { id: 'wulf', name: 'WULF Arts', icon: Building2, color: 'text-orange-600' },
    { id: 'plantryx', name: 'Plantryx', icon: Building2, color: 'text-indigo-600' },
  ];

  const filteredClients = clients.filter(
    (client) => isAdmin || clientAccess.includes(client.id)
  );

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="flex items-center justify-center">
          <img
            src="/intelsol-logo.png"
            alt="IntElsol"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === '/admin'
                ? 'bg-[#1a2647] text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
        )}

        <div className="pt-4 pb-2 px-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Clients
          </p>
        </div>

        {filteredClients.map((client) => (
          <Link
            key={client.id}
            href={`/${client.id}`}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname.startsWith(`/${client.id}`)
                ? 'bg-[#1a2647] text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <client.icon className={`w-5 h-5 ${pathname.startsWith(`/${client.id}`) ? 'text-white' : client.color}`} />
            <span className="font-medium">{client.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          © 2026 IntElsol. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
