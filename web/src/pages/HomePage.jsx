import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, ShieldCheck, UserCog, HandHeart, User, ArrowRight, Activity, Cpu, Network } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STATS } from '../lib/data';

const ROLES = [
  { id: 'officer', label: 'Government Officer', icon: UserCog, desc: 'Full access · approvals & analytics' },
  { id: 'ngo', label: 'NGO Partner', icon: HandHeart, desc: 'Case management & assignments' },
  { id: 'citizen', label: 'Citizen', icon: User, desc: 'View your Digital Twin & schemes' },
];

export default function HomePage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState('officer');
  const [name, setName] = useState('');

  const enter = () => { login(name.trim(), role); nav('/app'); };

  return (
    <div className="min-h-[100dvh] grid-bg">
      <header className="flex items-center gap-2 px-6 h-16 max-w-7xl mx-auto">
        <BrainCircuit className="text-primary" size={26} />
        <span className="font-display font-bold text-lg">Bharat Drishti</span>
        <span className="ml-2 text-[10px] tracking-widest text-muted-foreground hidden sm:block">COGNITIVE PUBLIC INFRASTRUCTURE</span>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs mb-6 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" /> India's vision for 2035
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold leading-[1.05]">
            Governance that <span className="text-primary">predicts</span>,
            <br />not just reacts.
          </h1>
          <p className="text-muted-foreground mt-5 text-lg max-w-lg">
            An AI-powered Cognitive Public Infrastructure giving every citizen a Digital Twin — so India reaches people
            <span className="text-secondary"> before</span> problems arise.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
            {[[Activity, STATS.citizens, 'Citizens'], [Cpu, '8', 'AI Agents'], [Network, '15+', 'Departments']].map(([I, v, l], i) => (
              <div key={i} className="glass rounded-xl p-4">
                <I className="text-accent mb-2" size={18} />
                <p className="font-display font-bold text-lg leading-none">{v}</p>
                <p className="text-xs text-muted-foreground mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:p-8 fade-up">
          <div className="flex items-center gap-2 mb-1"><ShieldCheck className="text-secondary" size={20} /><h2 className="font-display text-xl font-bold">Secure Access</h2></div>
          <p className="text-sm text-muted-foreground mb-6">Select your role to enter the platform.</p>
          <div className="space-y-3 mb-5">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${role === r.id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}>
                <r.icon className={role === r.id ? 'text-primary' : 'text-muted-foreground'} size={20} />
                <div><p className="text-sm font-medium">{r.label}</p><p className="text-xs text-muted-foreground">{r.desc}</p></div>
              </button>
            ))}
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)"
            className="w-full bg-input rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 ring-primary mb-4" />
          <button onClick={enter}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition">
            Enter Dashboard <ArrowRight size={18} />
          </button>
          <p className="text-xs text-muted-foreground text-center mt-4">Prototype demo · no credentials required</p>
        </div>
      </main>
    </div>
  );
}
