/* eslint-disable import/namespace */
import React, { useMemo, useState } from 'react';
import { CITIZENS, DISTRICTS, STATS, PREDICTIONS, RECOMMENDATIONS, AGENTS, NGO_CASES, FORECAST, LEVEL_COLORS, LEVEL_LABEL } from '../lib/data';
import IndiaMap from '../components/IndiaMap';
import * as Icons from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const Card = ({ className = '', children }) => (
  <div className={`glass rounded-xl p-5 fade-up ${className}`}>{children}</div>
);
const Title = ({ children, sub }) => (
  <div className="mb-6">
    <h1 className="font-display text-2xl lg:text-3xl font-bold">{children}</h1>
    {sub && <p className="text-muted-foreground text-sm mt-1">{sub}</p>}
  </div>
);
const riskColor = (r) => (r >= 75 ? 'text-red-400' : r >= 60 ? 'text-orange-400' : r >= 45 ? 'text-yellow-400' : 'text-green-400');

const tooltipStyle = { background: 'hsl(224 33% 9%)', border: '1px solid hsl(223 25% 20%)', borderRadius: 8, fontSize: 12 };

/* ---------------- HOME ---------------- */
export function HomeDashboard() {
  const [sel, setSel] = useState(DISTRICTS[0]);
  const stats = [
    { label: 'Citizens Tracked', value: STATS.citizens, icon: 'Users', c: 'text-accent' },
    { label: 'High Risk', value: STATS.highRisk, icon: 'AlertTriangle', c: 'text-orange-400' },
    { label: 'Health Alerts', value: STATS.health, icon: 'HeartPulse', c: 'text-rose-400' },
    { label: 'Education Alerts', value: STATS.education, icon: 'GraduationCap', c: 'text-blue-400' },
    { label: 'Farmer Alerts', value: STATS.farmer, icon: 'Wheat', c: 'text-amber-400' },
    { label: 'Emergency Cases', value: STATS.emergency, icon: 'Siren', c: 'text-red-400' },
  ];
  return (
    <div>
      <Title sub="Real-time cognitive overview of India's public welfare risk landscape.">Home Dashboard</Title>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((s) => {
          const I = Icons[s.icon];
          return (
            <Card key={s.label} className="!p-4">
              <I className={s.c} size={20} />
              <p className="font-display text-xl lg:text-2xl font-bold mt-2">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Card>
          );
        })}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="font-display font-semibold mb-3">Interactive District Risk Map</h2>
          <IndiaMap selected={sel} onSelect={setSel} />
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ background: LEVEL_COLORS[sel.level] }} />
            <h2 className="font-display font-semibold">{sel.name}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">{sel.state} · Status: {LEVEL_LABEL[sel.level]}</p>
          <div className="space-y-3">
            {[['Average Risk Score', sel.avgRisk + '%'], ['Citizens Sampled', sel.citizens], ['High-Risk Citizens', sel.highRisk]].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">{k}</span>
                <span className="font-display font-semibold">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: sel.avgRisk + '%', background: LEVEL_COLORS[sel.level] }} />
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            AI recommends {sel.level === 'critical' || sel.level === 'high' ? 'immediate intervention' : 'continued monitoring'} for this district based on aggregated Digital Twin signals.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- DIGITAL TWIN ---------------- */
export function DigitalTwin() {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(CITIZENS[0]);
  const results = useMemo(() => {
    if (!q) return CITIZENS.slice(0, 8);
    const s = q.toLowerCase();
    return CITIZENS.filter((c) => c.name.toLowerCase().includes(s) || c.id.toLowerCase().includes(s) || c.district.toLowerCase().includes(s)).slice(0, 12);
  }, [q]);
  const dims = active ? [
    ['Education', active.education, 'GraduationCap'], ['Health', active.health, 'HeartPulse'],
    ['Accessibility', active.accessibility, 'Accessibility'], ['Finance', active.finance, 'IndianRupee'],
    ['Women Safety', active.women, 'ShieldCheck'], ['Disaster Exposure', active.disaster, 'CloudRain'],
    ['Location', active.district + ', ' + active.state, 'MapPin'], ['Demographics', active.age + ' yrs · ' + active.gender, 'User'],
  ] : [];
  return (
    <div>
      <Title sub="Search any citizen to view their AI-generated Digital Twin across 8 life dimensions.">Digital Twin Search</Title>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <div className="relative mb-3">
            <Icons.Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, ID or district…"
              className="w-full bg-input rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 ring-primary" />
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {results.map((c) => (
              <button key={c.id} onClick={() => setActive(c)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${active?.id === c.id ? 'bg-primary/15' : 'hover:bg-muted'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className={`text-xs font-semibold ${riskColor(c.risk)}`}>{c.risk}%</span>
                </div>
                <p className="text-xs text-muted-foreground">{c.id} · {c.district}</p>
              </button>
            ))}
            {results.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No citizens found.</p>}
          </div>
        </Card>
        <Card className="lg:col-span-2">
          {active && (
            <>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/20 text-primary grid place-items-center font-display text-xl font-bold">{active.name[0]}</div>
                <div>
                  <h2 className="font-display text-xl font-bold">{active.name}</h2>
                  <p className="text-sm text-muted-foreground">{active.id} · {active.age} yrs · {active.gender}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className={`font-display text-3xl font-bold ${riskColor(active.risk)}`}>{active.risk}%</p>
                  <p className="text-xs text-muted-foreground">Composite Risk Score</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {dims.map(([k, v, ic]) => {
                  const I = Icons[ic];
                  return (
                    <div key={k} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                      <I className="text-accent mt-0.5" size={18} />
                      <div><p className="text-xs text-muted-foreground">{k}</p><p className="text-sm font-medium">{v}</p></div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mb-2">Active Government Schemes</p>
              <div className="flex flex-wrap gap-2">
                {active.schemes.map((s) => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30">{s}</span>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- PREDICTIONS ---------------- */
export function Predictions() {
  return (
    <div>
      <Title sub="Ranked future risks projected by specialized AI agents across the population.">Prediction Dashboard</Title>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display font-semibold mb-4">Risk Probability Ranking</h2>
          <div className="space-y-4">
            {PREDICTIONS.map((p) => {
              const T = p.trend === 'up' ? Icons.ArrowUpRight : p.trend === 'down' ? Icons.ArrowDownRight : Icons.MoveRight;
              return (
                <div key={p.risk}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-1"><T size={14} className={p.trend === 'up' ? 'text-red-400' : p.trend === 'down' ? 'text-green-400' : 'text-muted-foreground'} />{p.risk}</span>
                    <span className={`font-display font-bold ${riskColor(p.prob)}`}>{p.prob}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: p.prob + '%', background: LEVEL_COLORS[p.prob >= 75 ? 'critical' : p.prob >= 60 ? 'high' : 'attention'] }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{p.agent} · {p.affected.toLocaleString('en-IN')} citizens at risk</p>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h2 className="font-display font-semibold mb-4">Probability Distribution</h2>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={PREDICTIONS} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(223 25% 20%)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(215 20% 65%)" fontSize={11} />
              <YAxis type="category" dataKey="risk" width={110} stroke="hsl(215 20% 65%)" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(223 25% 15% / 0.5)' }} />
              <Bar dataKey="prob" radius={[0, 4, 4, 0]}>
                {PREDICTIONS.map((p, i) => <Cell key={i} fill={LEVEL_COLORS[p.prob >= 75 ? 'critical' : p.prob >= 60 ? 'high' : 'attention']} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- RECOMMENDATIONS ---------------- */
export function Recommendations() {
  const [approved, setApproved] = useState({});
  return (
    <div>
      <Title sub="Actionable interventions generated by the recommendation engine, awaiting government approval.">AI Recommendations</Title>
      <div className="grid md:grid-cols-2 gap-5">
        {RECOMMENDATIONS.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.priority === 'High' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>{r.priority} Priority</span>
                <h2 className="font-display font-semibold mt-2">{r.title}</h2>
              </div>
              <Icons.Lightbulb className="text-primary shrink-0" size={20} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-muted/40 rounded-lg py-2"><p className="text-xs text-muted-foreground">Impact</p><p className="text-sm font-semibold">{r.impact}</p></div>
              <div className="bg-muted/40 rounded-lg py-2"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-sm font-semibold">{r.cost}</p></div>
              <div className="bg-muted/40 rounded-lg py-2"><p className="text-xs text-muted-foreground">Success</p><p className="text-sm font-semibold text-secondary">{r.success}%</p></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{r.agent}</span>
              <button onClick={() => setApproved((a) => ({ ...a, [r.id]: !a[r.id] }))}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${approved[r.id] ? 'bg-secondary/20 text-secondary' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
                {approved[r.id] ? '✓ Approved' : 'Approve'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- AGENTS ---------------- */
export function Agents() {
  return (
    <div>
      <Title sub="Eight specialized AI agents continuously analyzing citizen Digital Twins.">AI Agents</Title>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {AGENTS.map((a) => {
          const I = Icons[a.icon];
          return (
            <Card key={a.name}>
              <I className={a.color} size={26} />
              <h2 className="font-display font-semibold mt-3">{a.name}</h2>
              <p className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed">{a.desc}</p>
              <div className="flex justify-between text-xs border-t border-border pt-3">
                <span className="text-muted-foreground">Cases: <span className="text-foreground font-medium">{a.cases.toLocaleString('en-IN')}</span></span>
                <span className="text-muted-foreground">Acc: <span className="text-secondary font-medium">{a.accuracy}%</span></span>
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="mt-6">
        <h2 className="font-display font-semibold mb-4">Cognitive Workflow Pipeline</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['Citizen Data', 'AI Cleansing', 'Digital Twin', 'Prediction Agent', 'Risk Score', 'Recommendation', 'Gov Approval', 'Citizen Helped', 'Feedback → AI Learns'].map((s, i, arr) => (
            <React.Fragment key={s}>
              <span className="px-3 py-1.5 rounded-lg bg-muted/50 whitespace-nowrap">{s}</span>
              {i < arr.length - 1 && <Icons.ChevronRight size={14} className="text-primary" />}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- NGO ---------------- */
export function NGODashboard() {
  const cats = ['Children', 'Women', 'Disabled', 'Elderly'];
  const statusColor = { Open: 'text-yellow-400', Assigned: 'text-accent', 'In Progress': 'text-orange-400', Resolved: 'text-secondary' };
  return (
    <div>
      <Title sub="Vulnerable cases routed by the NGO Agent to partner organizations for action.">NGO Dashboard</Title>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {cats.map((c) => (
          <Card key={c} className="!p-4">
            <p className="font-display text-2xl font-bold">{NGO_CASES.filter((x) => x.category === c).length}</p>
            <p className="text-xs text-muted-foreground">{c} cases</p>
          </Card>
        ))}
      </div>
      <Card className="overflow-x-auto">
        <h2 className="font-display font-semibold mb-4">Active Cases</h2>
        <table className="w-full text-sm min-w-[640px]">
          <thead><tr className="text-left text-muted-foreground text-xs border-b border-border">
            {['Case ID', 'Citizen', 'Category', 'Issue', 'District', 'NGO', 'Status'].map((h) => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {NGO_CASES.map((c) => (
              <tr key={c.id} className="border-b border-border/60">
                <td className="py-3 pr-4 font-mono text-xs">{c.id}</td>
                <td className="py-3 pr-4">{c.citizen}</td>
                <td className="py-3 pr-4">{c.category}</td>
                <td className="py-3 pr-4 text-muted-foreground">{c.issue}</td>
                <td className="py-3 pr-4">{c.district}</td>
                <td className="py-3 pr-4">{c.ngo}</td>
                <td className={`py-3 pr-4 font-medium ${statusColor[c.status]}`}>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ---------------- ACCESSIBILITY ---------------- */
export function AccessibilityPage() {
  const feats = [
    ['Screen Reader Support', 'ScanLine', 'Full ARIA labelling & semantic navigation for assistive tech.'],
    ['Voice Assistant', 'Mic', 'Navigate & query dashboards using natural voice commands.'],
    ['Indian Languages', 'Languages', 'Available in 22 official languages including Hindi, Tamil, Bengali.'],
    ['Sign Language Videos', 'Video', 'ISL video explainers for every welfare scheme.'],
    ['Easy Reading Mode', 'BookOpen', 'Simplified plain-language layouts with larger type.'],
    ['Offline Mode', 'WifiOff', 'Core services cached for low-connectivity rural regions.'],
  ];
  const [on, setOn] = useState({});
  return (
    <div>
      <Title sub="Accessibility-first design ensuring no citizen is left behind.">Accessibility Dashboard</Title>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {feats.map(([t, ic, d]) => {
          const I = Icons[ic];
          return (
            <Card key={t}>
              <div className="flex items-start justify-between">
                <I className="text-violet-400" size={24} />
                <button onClick={() => setOn((s) => ({ ...s, [t]: !s[t] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${on[t] ? 'bg-secondary' : 'bg-muted'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on[t] ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <h2 className="font-display font-semibold mt-3">{t}</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- FORECAST ---------------- */
export function Forecast() {
  const lines = [
    ['flood', 'Flood Risk', '#06b6d4'], ['crop', 'Crop Failure', '#f59e0b'],
    ['dropout', 'School Dropout', '#3b82f6'], ['health', 'Healthcare Load', '#f43f5e'], ['migration', 'Migration', '#a78bfa'],
  ];
  return (
    <div>
      <Title sub="30-day AI time-series projection across critical welfare indicators.">Forecast Dashboard</Title>
      <Card className="mb-6">
        <h2 className="font-display font-semibold mb-4">30-Day Trend Projection</h2>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={FORECAST}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(223 25% 20%)" />
            <XAxis dataKey="day" stroke="hsl(215 20% 65%)" fontSize={10} interval={4} />
            <YAxis stroke="hsl(215 20% 65%)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            {lines.map(([k, , c]) => <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={2} dot={false} />)}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-3">
          {lines.map(([k, l, c]) => <span key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-1 rounded" style={{ background: c }} />{l}</span>)}
        </div>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {lines.map(([k, l, c]) => (
          <Card key={k}>
            <h3 className="text-sm font-medium mb-2">{l}</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={FORECAST}>
                <defs><linearGradient id={'g' + k} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity={0.4} /><stop offset="100%" stopColor={c} stopOpacity={0} /></linearGradient></defs>
                <Area type="monotone" dataKey={k} stroke={c} strokeWidth={2} fill={`url(#g${k})`} />
                <Tooltip contentStyle={tooltipStyle} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        ))}
      </div>
    </div>
  );
}
