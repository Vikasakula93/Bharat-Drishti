import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserSearch, TrendingUp, Lightbulb, HandHeart, Accessibility, LineChart, Bot, LogOut, Menu, X, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/app', label: 'Home Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/twin', label: 'Digital Twin', icon: UserSearch },
  { to: '/app/predictions', label: 'Predictions', icon: TrendingUp },
  { to: '/app/recommendations', label: 'AI Recommendations', icon: Lightbulb },
  { to: '/app/agents', label: 'AI Agents', icon: Bot },
  { to: '/app/ngo', label: 'NGO Dashboard', icon: HandHeart },
  { to: '/app/accessibility', label: 'Accessibility', icon: Accessibility },
  { to: '/app/forecast', label: 'Forecast', icon: LineChart },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed z-40 inset-y-0 left-0 w-64 glass border-r flex flex-col transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
          <BrainCircuit className="text-primary" size={24} />
          <div>
            <p className="font-display font-bold leading-none">Bharat Drishti</p>
            <p className="text-[10px] text-muted-foreground tracking-wider">COGNITIVE PUBLIC INFRA</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <n.icon size={18} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary grid place-items-center font-semibold text-sm">
              {(user?.name || 'U')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <button onClick={() => { logout(); nav('/'); }} className="text-muted-foreground hover:text-destructive p-1.5" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="sticky top-0 z-20 h-16 glass border-b flex items-center gap-3 px-4 lg:px-8">
          <button className="lg:hidden text-foreground" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary pulse-dot" />
            <span className="text-muted-foreground">Live AI Engine · <span className="text-secondary">Active</span></span>
          </div>
          <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
