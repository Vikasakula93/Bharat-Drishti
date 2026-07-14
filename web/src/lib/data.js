// Mock data engine 

const first = ['Aarav','Vivaan','Aditya','Ananya','Diya','Ishaan','Kabir','Meera','Riya','Arjun','Saanvi','Reyansh','Anaya','Krishna','Aadhya','Vihaan','Myra','Sai','Aarohi','Advik','Priya','Rohan','Neha','Kavya','Aryan','Ira','Dev','Tara','Yash','Zoya','Fatima','Imran','Lakshmi','Manoj','Nisha','Pooja','Rahul','Sunita','Vikram','Deepa'];
const last = ['Sharma','Verma','Patel','Reddy','Nair','Iyer','Das','Khan','Singh','Gupta','Yadav','Naidu','Mishra','Chauhan','Bose','Rao','Kaur','Pillai','Joshi','Mehta'];
const districtsList = [
  { name: 'Nashik', state: 'Maharashtra', x: 30, y: 46 },
  { name: 'Barabanki', state: 'Uttar Pradesh', x: 50, y: 34 },
  { name: 'Murshidabad', state: 'West Bengal', x: 74, y: 40 },
  { name: 'Koraput', state: 'Odisha', x: 62, y: 52 },
  { name: 'Wayanad', state: 'Kerala', x: 34, y: 82 },
  { name: 'Barmer', state: 'Rajasthan', x: 22, y: 34 },
  { name: 'Dhemaji', state: 'Assam', x: 86, y: 32 },
  { name: 'Bastar', state: 'Chhattisgarh', x: 54, y: 50 },
  { name: 'Vidisha', state: 'Madhya Pradesh', x: 42, y: 44 },
  { name: 'Anantapur', state: 'Andhra Pradesh', x: 44, y: 68 },
  { name: 'Sitamarhi', state: 'Bihar', x: 66, y: 36 },
  { name: 'Kutch', state: 'Gujarat', x: 16, y: 46 },
  { name: 'Kalahandi', state: 'Odisha', x: 60, y: 55 },
  { name: 'Ganjam', state: 'Odisha', x: 64, y: 58 },
  { name: 'Nuh', state: 'Haryana', x: 40, y: 30 },
];

const eduStatus = ['Enrolled - Grade 4', 'Enrolled - Grade 8', 'Enrolled - Grade 11', 'Dropout Risk', 'Out of School', 'Graduate', 'College'];
const healthStatus = ['Healthy', 'Chronic - Diabetes', 'Malnutrition Risk', 'Anemia', 'Under Treatment', 'Vaccination Due'];
const accessNeeds = ['None', 'Visual Impairment', 'Hearing Impairment', 'Mobility Assistance', 'Cognitive Support'];
const schemesAll = ['PM-KISAN', 'Ayushman Bharat', 'Post-Matric Scholarship', 'PMAY Housing', 'MGNREGA', 'Ujjwala Yojana', 'Sukanya Samriddhi', 'Mid-Day Meal', 'Old Age Pension'];

function seeded(i) { const x = Math.sin(i * 999.13) * 10000; return x - Math.floor(x); }

export const CITIZENS = Array.from({ length: 128 }, (_, i) => {
  const r = (n) => seeded(i * 7 + n);
  const d = districtsList[Math.floor(r(1) * districtsList.length)];
  const age = 4 + Math.floor(r(2) * 74);
  const risk = Math.floor(r(3) * 100);
  const nSchemes = 1 + Math.floor(r(9) * 3);
  return {
    id: 'BHR-' + (100000 + i),
    name: first[Math.floor(r(4) * first.length)] + ' ' + last[Math.floor(r(5) * last.length)],
    age,
    gender: r(6) > 0.5 ? 'Female' : 'Male',
    district: d.name,
    state: d.state,
    education: age < 25 ? eduStatus[Math.floor(r(7) * eduStatus.length)] : 'Graduate',
    health: healthStatus[Math.floor(r(8) * healthStatus.length)],
    accessibility: accessNeeds[Math.floor(r(10) * accessNeeds.length)],
    finance: r(11) > 0.6 ? 'Debt Risk' : (r(11) > 0.3 ? 'Stable' : 'Below Poverty Line'),
    women: r(6) > 0.5 ? (r(12) > 0.7 ? 'Safety Alert Zone' : 'Safe') : 'N/A',
    disaster: r(13) > 0.75 ? 'Flood-Prone Zone' : 'Low Exposure',
    schemes: [...schemesAll].sort(() => r(14) - 0.5).slice(0, nSchemes),
    risk,
  };
});

export const DISTRICTS = districtsList.map((d, i) => {
  const citizens = CITIZENS.filter((c) => c.district === d.name);
  const avg = citizens.length ? Math.round(citizens.reduce((s, c) => s + c.risk, 0) / citizens.length) : 40;
  let level = 'good';
  if (avg >= 75) level = 'critical'; else if (avg >= 60) level = 'high'; else if (avg >= 45) level = 'attention';
  return { ...d, id: i, avgRisk: avg, level, citizens: citizens.length, highRisk: citizens.filter((c) => c.risk >= 70).length };
});

export const STATS = {
  citizens: '1,25,00,000',
  highRisk: '25,621',
  health: '8,311',
  education: '3,210',
  farmer: '2,114',
  emergency: '511',
};

export const PREDICTIONS = [
  { risk: 'School Dropout', prob: 86, agent: 'Education Agent', affected: 3210, trend: 'up' },
  { risk: 'Farmer Debt Default', prob: 82, agent: 'Agriculture Agent', affected: 2114, trend: 'up' },
  { risk: 'Flood Displacement', prob: 71, agent: 'Disaster Agent', affected: 5400, trend: 'up' },
  { risk: 'Disease Spread (Dengue)', prob: 68, agent: 'Health Agent', affected: 8311, trend: 'flat' },
  { risk: 'Child Marriage', prob: 61, agent: 'NGO Agent', affected: 890, trend: 'down' },
  { risk: 'Malnutrition (Child)', prob: 58, agent: 'Health Agent', affected: 1240, trend: 'up' },
  { risk: 'Women Safety Incident', prob: 47, agent: 'Women Safety Agent', affected: 640, trend: 'flat' },
  { risk: 'Crop Failure', prob: 44, agent: 'Agriculture Agent', affected: 1980, trend: 'down' },
];

export const RECOMMENDATIONS = [
  { id: 1, title: 'Renew Post-Matric Scholarship', priority: 'High', impact: 'High', cost: '₹12,000', success: 92, agent: 'Education Agent', desc: 'Auto-renew scholarships for 3,210 students flagged as dropout risk before term deadline.' },
  { id: 2, title: 'Emergency Debt Relief Package', priority: 'High', impact: 'High', cost: '₹48,00,000', success: 78, agent: 'Finance Agent', desc: 'Restructure loans for 2,114 farmers in Nashik & Barmer to prevent default cascade.' },
  { id: 3, title: 'Pre-Monsoon Flood Evacuation Plan', priority: 'High', impact: 'Critical', cost: '₹1,20,00,000', success: 85, agent: 'Disaster Agent', desc: 'Deploy relief camps & alerts to 5,400 residents in flood-prone Assam districts.' },
  { id: 4, title: 'Dengue Fumigation Drive', priority: 'Medium', impact: 'High', cost: '₹22,00,000', success: 74, agent: 'Health Agent', desc: 'Targeted vector control in 8 high-density wards showing 68% outbreak probability.' },
  { id: 5, title: 'Nutrition Kit Distribution', priority: 'Medium', impact: 'Medium', cost: '₹8,50,000', success: 88, agent: 'Health Agent', desc: 'Supplement 1,240 children flagged for malnutrition via Anganwadi network.' },
  { id: 6, title: 'Women Safety Patrol Expansion', priority: 'Medium', impact: 'High', cost: '₹15,00,000', success: 69, agent: 'Women Safety Agent', desc: 'Increase night patrols & install SOS beacons across 4 alert zones.' },
];

export const AGENTS = [
  { name: 'Education Agent', icon: 'GraduationCap', color: 'text-blue-400', desc: 'Predicts dropouts, tracks enrollment, auto-renews scholarships.', cases: 3210, accuracy: 94 },
  { name: 'Health Agent', icon: 'HeartPulse', color: 'text-rose-400', desc: 'Monitors outbreaks, malnutrition, vaccination gaps.', cases: 8311, accuracy: 91 },
  { name: 'Agriculture Agent', icon: 'Wheat', color: 'text-amber-400', desc: 'Forecasts crop failure, debt risk, mandi price shocks.', cases: 2114, accuracy: 89 },
  { name: 'Accessibility Agent', icon: 'Accessibility', color: 'text-violet-400', desc: 'Ensures inclusion for citizens with disabilities.', cases: 640, accuracy: 96 },
  { name: 'Finance Agent', icon: 'IndianRupee', color: 'text-emerald-400', desc: 'Detects financial distress, manages relief disbursal.', cases: 1980, accuracy: 87 },
  { name: 'Women Safety Agent', icon: 'ShieldCheck', color: 'text-pink-400', desc: 'Maps safety alert zones, triggers rapid response.', cases: 640, accuracy: 83 },
  { name: 'Disaster Agent', icon: 'CloudRain', color: 'text-cyan-400', desc: 'Predicts floods, coordinates evacuation & relief.', cases: 5400, accuracy: 90 },
  { name: 'NGO Agent', icon: 'HandHeart', color: 'text-orange-400', desc: 'Routes vulnerable cases to partner NGOs.', cases: 890, accuracy: 92 },
];

export const NGO_CASES = [
  { id: 'NGO-2201', citizen: 'Aadhya Kaur', category: 'Children', issue: 'Dropout + child labour risk', district: 'Bastar', status: 'Assigned', ngo: 'Bachpan Bachao' },
  { id: 'NGO-2202', citizen: 'Fatima Khan', category: 'Women', issue: 'Domestic safety alert', district: 'Nuh', status: 'In Progress', ngo: 'Shakti Foundation' },
  { id: 'NGO-2203', citizen: 'Manoj Das', category: 'Disabled', issue: 'Mobility aid + pension gap', district: 'Koraput', status: 'Open', ngo: 'Enable India' },
  { id: 'NGO-2204', citizen: 'Sunita Rao', category: 'Elderly', issue: 'Old age pension lapse', district: 'Anantapur', status: 'Resolved', ngo: 'HelpAge India' },
  { id: 'NGO-2205', citizen: 'Imran Sheikh', category: 'Children', issue: 'Malnutrition - grade II', district: 'Sitamarhi', status: 'In Progress', ngo: 'Akshaya Patra' },
  { id: 'NGO-2206', citizen: 'Deepa Nair', category: 'Women', issue: 'Skill training enrollment', district: 'Wayanad', status: 'Open', ngo: 'SEWA' },
];

export const FORECAST = Array.from({ length: 30 }, (_, i) => {
  const r = (n) => seeded(i * 3 + n);
  return {
    day: 'D' + (i + 1),
    flood: Math.round(40 + i * 1.1 + r(1) * 12),
    crop: Math.round(55 - i * 0.5 + r(2) * 10),
    dropout: Math.round(50 + i * 0.9 + r(3) * 8),
    health: Math.round(45 + Math.sin(i / 4) * 15 + r(4) * 6),
    migration: Math.round(30 + i * 0.7 + r(5) * 9),
  };
});

export const LEVEL_COLORS = {
  good: '#22c55e',
  attention: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};
export const LEVEL_LABEL = { good: 'Good', attention: 'Attention', high: 'High Risk', critical: 'Critical' };