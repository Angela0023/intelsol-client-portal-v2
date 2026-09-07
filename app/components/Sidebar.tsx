'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BarChart3, Users, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  clientAccess: string[];
}

interface Client {
  id: string;
  name: string;
  icon: typeof Building2;
  color: string;
}

export default function Sidebar({ clientAccess }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = clientAccess.includes('admin');

  const defaultClients: Client[] = [
    { id: 'demo', name: 'Demo (Sample)', icon: Building2, color: 'text-cyan-600' },
    { id: 'xpose', name: 'Xpose Solutions', icon: Building2, color: 'text-blue-600' },
    { id: 'tslab', name: 'TS Lab', icon: Building2, color: 'text-green-600' },
    { id: 'adsigner', name: 'AdSigner', icon: Building2, color: 'text-teal-600' },
    { id: 'beeit', name: 'BeeIt', icon: Building2, color: 'text-amber-600' },
    { id: 'intelsol', name: 'Intelsol', icon: Building2, color: 'text-violet-600' },
    { id: 'wulf', name: 'WULF Arts', icon: Building2, color: 'text-orange-600' },
    { id: 'peoplefocus', name: 'People Focus', icon: Building2, color: 'text-purple-600' },
    { id: 'plantryx', name: 'Plantryx', icon: Building2, color: 'text-indigo-600' },
    { id: 'mountaindrop', name: 'Mountaindrop', icon: Building2, color: 'text-emerald-600' },
    { id: 'eblissai', name: 'eBlissAI', icon: Building2, color: 'text-sky-600' },
    { id: 'zen2fit', name: 'Zen2Fit', icon: Building2, color: 'text-pink-600' },
    { id: 'panorate', name: 'Panorate Media', icon: Building2, color: 'text-slate-600' },
    { id: 'mbedtronix', name: 'MBEDTRONIX', icon: Building2, color: 'text-indigo-600' },
  ];

  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Load saved order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('intelsol_client_order');
    if (savedOrder) {
      try {
        const orderIds: string[] = JSON.parse(savedOrder);
        const orderedClients = orderIds
          .map(id => defaultClients.find(c => c.id === id))
          .filter(Boolean) as Client[];

        // Add any new clients that weren't in the saved order
        const newClients = defaultClients.filter(
          c => !orderIds.includes(c.id)
        );

        setClients([...orderedClients, ...newClients]);
      } catch (e) {
        console.error('Failed to parse client order:', e);
      }
    }
  }, []);

  // Save order to localStorage whenever it changes
  const saveOrder = (newOrder: Client[]) => {
    const orderIds = newOrder.map(c => c.id);
    localStorage.setItem('intelsol_client_order', JSON.stringify(orderIds));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newClients = [...clients];
    const draggedClient = newClients[draggedIndex];

    newClients.splice(draggedIndex, 1);
    newClients.splice(index, 0, draggedClient);

    setClients(newClients);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      saveOrder(clients);
    }
    setDraggedIndex(null);
  };

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

        {filteredClients.map((client, index) => (
          <div
            key={client.id}
            draggable={isAdmin}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={isAdmin ? 'cursor-move' : ''}
          >
            <Link
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
          </div>
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
