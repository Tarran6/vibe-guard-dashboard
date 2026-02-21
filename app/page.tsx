'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockGrowth = [
  { day: 'Feb 15', scans: 1240 },
  { day: 'Feb 16', scans: 2890 },
  { day: 'Feb 17', scans: 4520 },
  { day: 'Feb 18', scans: 6710 },
  { day: 'Feb 19', scans: 8430 },
  { day: 'Feb 20', scans: 10200 },
  { day: 'Feb 21', scans: 12450 },
];

export default function VibeGuardDashboard() {
  const [metrics, setMetrics] = useState({
    scans: 12450,
    wallets: 1420,
    prevented: '1.42',
    active: 873,
  });
  const [recentScans, setRecentScans] = useState([
    { time: '2m ago', contract: '0x8f3...a1b2', score: 92, status: 'SAFE' },
    { time: '7m ago', contract: '0x4d9...c3e4', score: 12, status: 'DRAINER' },
    { time: '14m ago', contract: '0x2a7...f93', score: 98, status: 'SAFE' },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        scans: prev.scans + Math.floor(Math.random() * 50),
        wallets: prev.wallets + Math.floor(Math.random() * 3),
      }));
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00ff9f] to-[#00b36b] rounded-2xl flex items-center justify-center shield-icon">
              <Shield className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold neon-text">VibeGuard AI</h1>
              <p className="text-[#00ff9f99] text-sm">Neural Security Sentinel • opBNB Mainnet</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="px-4 py-2 bg-[#00ff9f10] border border-[#00ff9f33] rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ff9f] rounded-full animate-pulse" />
              LIVE
            </div>
            <button
              onClick={fetchMetrics}
              className="flex items-center gap-2 px-5 py-2 bg-[#00ff9f10] hover:bg-[#00ff9f20] border border-[#00ff9f33] rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              REFRESH
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-8 rounded-3xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#00ff9f99] text-sm">TOTAL SCANS</p>
                <p className="text-5xl font-bold mt-3">{metrics.scans.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#00ff9f]" />
            </div>
          </div>

          <div className="card p-8 rounded-3xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#00ff9f99] text-sm">SHIELDED WALLETS</p>
                <p className="text-5xl font-bold mt-3">{metrics.wallets}</p>
              </div>
              <Users className="w-8 h-8 text-[#00ff9f]" />
            </div>
          </div>

          <div className="card p-8 rounded-3xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#00ff9f99] text-sm">PREVENTED LOSSES</p>
                <p className="text-5xl font-bold mt-3">${metrics.prevented}M</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-[#00ff9f]" />
            </div>
          </div>

          <div className="card p-8 rounded-3xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#00ff9f99] text-sm">ACTIVE PROTECTION</p>
                <p className="text-5xl font-bold mt-3">{metrics.active}</p>
              </div>
              <Shield className="w-8 h-8 text-[#00ff9f]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-8 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5" /> SCAN GROWTH (LAST 7 DAYS)
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00ff9f22" />
                  <XAxis dataKey="day" stroke="#00ff9f66" />
                  <YAxis stroke="#00ff9f66" />
                  <Tooltip contentStyle={{ background: '#111', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="scans" stroke="#00ff9f" strokeWidth={4} dot={{ fill: '#00ff9f', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-8 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6">RECENT SCANS</h2>
            <div className="space-y-4">
              {recentScans.map((scan, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[#00ff9f11] pb-4 last:border-0">
                  <div>
                    <p className="font-mono text-xs text-[#00ff9f99]">{scan.time}</p>
                    <p className="font-mono text-sm">{scan.contract}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Score: <span className="font-bold">{scan.score}</span></p>
                    <p className={`text-xs px-3 py-0.5 rounded-full inline-block mt-1 ${scan.status === 'SAFE' ? 'bg-[#00ff9f20] text-[#00ff9f]' : 'bg-red-500/20 text-red-400'}`}>
                      {scan.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => alert('WalletConnect coming soon in Mobile App 🚀')}
            className="px-12 py-5 bg-gradient-to-r from-[#00ff9f] to-[#00b36b] text-black font-bold text-lg rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#00ff9f50]"
          >
            SHIELD MY WALLET NOW
          </button>
          <p className="mt-4 text-[#00ff9f66] text-sm">Powered by Gemini 2.0 + Grok 4 • Protected by opBNB</p>
        </div>
      </div>
    </div>
  );
}