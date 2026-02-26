'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Users, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const API_BASE = 'https://vibeguard-ai-production-7512.up.railway.app'; // замените на ваш URL, если нужно

// Форматирование больших чисел (K, M)
const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
};

export default function VibeGuardDashboard() {
  const [metrics, setMetrics] = useState({ scans: 0, wallets: 0, prevented: 0, active: 0 });
  const [bnbPrice, setBnbPrice] = useState(600);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Функция загрузки данных с API
  const fetchData = async () => {
    try {
      const [statsRes, globalRes] = await Promise.all([
        fetch(`${API_BASE}/api/stats`),
        fetch(`${API_BASE}/api/global`)
      ]);
      const stats = await statsRes.json();
      const global = await globalRes.json();

      setMetrics({
        scans: stats.blocks,           // или другое поле, которое хотите показывать
        wallets: stats.wallets,
        prevented: global.total_protected_usd, // сумма в долларах
        active: stats.nft_minted
      });
      setBnbPrice(stats.bnb_price);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch stats', err);
      setLoading(false);
    }
  };

  // Загрузка при монтировании и каждые 30 секунд
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Анимированные счётчики (оставляем как есть)
  const animateValue = (start: number, end: number, duration: number, setter: (val: number) => void) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      setter(value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!loading) {
      animateValue(0, metrics.scans, 1800, (v) => setMetrics(prev => ({ ...prev, scans: v })));
      animateValue(0, metrics.wallets, 2000, (v) => setMetrics(prev => ({ ...prev, wallets: v })));
      animateValue(0, metrics.prevented, 2200, (v) => setMetrics(prev => ({ ...prev, prevented: v })));
      animateValue(0, metrics.active, 2400, (v) => setMetrics(prev => ({ ...prev, active: v })));
    }
  }, [loading, metrics.scans, metrics.wallets, metrics.prevented, metrics.active]);

  // Particles background (оставляем без изменений)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.fillStyle = `rgba(0, 243, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 bg-gradient-to-br from-[#00ff9f] to-[#00b36b] rounded-2xl flex items-center justify-center shadow-[0_0_30px_#00ff9f]">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter" style={{ textShadow: '0 0 20px #00ff9f' }}>
                VIBEGUARD AI
              </h1>
              <p className="text-[#00ff9f99] text-sm tracking-[3px] uppercase">NEURAL SECURITY SENTINEL • opBNB</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-[#00ff9f10] border border-[#00ff9f50] rounded-full flex items-center gap-3 text-sm">
              <div className="w-3 h-3 bg-[#00ff9f] rounded-full animate-ping" />
              LIVE ON opBNB
            </div>
            <button onClick={handleRefresh} className="flex items-center gap-2 px-6 py-3 bg-[#00ff9f10] hover:bg-[#00ff9f20] border border-[#00ff9f] rounded-xl transition-all">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              REFRESH
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: TrendingUp, label: "TOTAL SCANS", value: metrics.scans, color: "#00ff9f" },
            { icon: Users, label: "SHIELDED WALLETS", value: metrics.wallets, color: "#00ff9f" },
            { icon: AlertTriangle, label: "PREVENTED LOSSES", value: `$${formatNumber(metrics.prevented)}`, color: "#ff3366" },
            { icon: Shield, label: "ACTIVE GUARDIANS", value: metrics.active, color: "#00ff9f" },
          ].map((item, i) => (
            <div key={i} className="card group p-8 rounded-3xl border border-[#00ff9f30] hover:border-[#00ff9f] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_#00ff9f50]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#00ff9f80] text-sm tracking-widest">{item.label}</p>
                  <p className="text-5xl font-bold mt-4 transition-all group-hover:text-[#00ff9f]" style={{ textShadow: `0 0 15px ${item.color}` }}>
                    {item.value}
                  </p>
                </div>
                <item.icon className="w-10 h-10 text-[#00ff9f] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Recent (оставляем моковые, но можно заменить позже) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6" /> SCAN GROWTH — LAST 7 DAYS
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { day: 'Feb 15', scans: 1240 }, { day: 'Feb 16', scans: 2890 }, { day: 'Feb 17', scans: 4520 },
                  { day: 'Feb 18', scans: 6710 }, { day: 'Feb 19', scans: 8430 }, { day: 'Feb 20', scans: 10200 },
                  { day: 'Feb 21', scans: 12450 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00ff9f15" />
                  <XAxis dataKey="day" stroke="#00ff9f66" />
                  <YAxis stroke="#00ff9f66" />
                  <Tooltip contentStyle={{ background: '#111', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="scans" stroke="#00ff9f" strokeWidth={5} dot={{ fill: '#00ff9f', r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold mb-6">RECENT SCANS</h2>
            <div className="space-y-5">
              {[
                { time: '2m ago', contract: '0x8f3...a1b2', score: 92, status: 'SAFE' },
                { time: '7m ago', contract: '0x4d9...c3e4', score: 12, status: 'DRAINER' },
                { time: '14m ago', contract: '0x2a7...f93', score: 98, status: 'SAFE' },
              ].map((scan, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[#00ff9f10] pb-5 last:border-0">
                  <div>
                    <p className="font-mono text-xs text-[#00ff9f80]">{scan.time}</p>
                    <p className="font-mono text-sm mt-1">{scan.contract}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">Score {scan.score}</p>
                    <p className={`text-xs px-4 py-1 rounded-full inline-block mt-2 ${scan.status === 'SAFE' ? 'bg-[#00ff9f20] text-[#00ff9f]' : 'bg-red-500/20 text-red-400'}`}>
                      {scan.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="px-16 py-6 bg-gradient-to-r from-[#00ff9f] to-[#00cc77] text-black font-black text-2xl rounded-3xl hover:scale-110 transition-all shadow-2xl shadow-[#00ff9f80]">
            SHIELD MY WALLET NOW
          </button>
          <p className="mt-6 text-[#00ff9f60] text-sm">Powered by Gemini 2.0 + Grok 4 • Protected by opBNB</p>
        </div>
      </div>
    </div>
  );
}