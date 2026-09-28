"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Ticket, 
  Users, 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  Activity, 
  Download, 
  MousePointer2, 
  ArrowUpRight, 
  X, 
  Menu, 
  Loader2, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Analytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30days");
  const [currency, setCurrency] = useState("PKR");
  const [isLoading, setIsLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalPageViews: "0",
      pageViewsTrend: "+0%",
      conversionRate: "0%",
      conversionRateTrend: "+0%",
      ticketsSold: "0",
      ticketsSoldTrend: "+0",
      totalRevenue: "PKR 0",
      revenueTrend: "+0%",
      checkedInCount: 0,
      checkInRate: "0%",
    },
    timelineData: [],
    trafficSources: [],
    topEvents: [],
    tierDistribution: { VIP: 0, Standard: 0, EarlyBird: 0 },
  });

  const loadAnalytics = async (selectedRange = timeRange, selectedCurrency = currency) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        range: selectedRange,
        currency: selectedCurrency,
      });

      const res = await fetch(`/api/organizer/analytics?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(timeRange, currency);
  }, [timeRange, currency]);

  const handleDownloadReport = () => {
    window.open("/api/organizer/export?type=registrations&format=csv", "_blank");
  };

  const { summary, timelineData, trafficSources, topEvents, tierDistribution } = analyticsData;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="analytics" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Performance Analytics</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Real-time breakdown of event revenue, ticket conversions, and traffic.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto flex-wrap">
            {/* Currency Selector */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1.5 uppercase ml-1">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer py-1.5 pr-2"
              >
                <option value="PKR" className="dark:bg-slate-900">PKR (₨)</option>
                <option value="USD" className="dark:bg-slate-900">USD ($)</option>
                <option value="EUR" className="dark:bg-slate-900">EUR (€)</option>
                <option value="GBP" className="dark:bg-slate-900">GBP (£)</option>
                <option value="AED" className="dark:bg-slate-900">AED (د.إ)</option>
                <option value="SAR" className="dark:bg-slate-900">SAR (﷼)</option>
              </select>
            </div>

            {/* Timeframe Filter */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer h-11 shadow-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

            <Button 
              onClick={handleDownloadReport}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold rounded-xl h-11 px-5 shadow-lg shadow-slate-900/10 shrink-0 text-sm"
            >
              <Download size={16} className="mr-2 shrink-0" /> Download Report
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-blue h-10 w-10 mb-4" />
            <p className="text-slate-500 font-bold text-sm">Calculating real-time analytics...</p>
          </div>
        ) : (
          <>
            {/* Dynamic Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Page Views" value={summary.totalPageViews} trend={summary.pageViewsTrend} icon={<Activity size={24} className="text-brand-blue" />} />
              <StatCard title="Conversion Rate" value={summary.conversionRate} trend={summary.conversionRateTrend} icon={<MousePointer2 size={24} className="text-purple-500" />} />
              <StatCard title="Tickets Sold" value={summary.ticketsSold} trend={summary.ticketsSoldTrend} icon={<Ticket size={24} className="text-emerald-500" />} />
              <StatCard title="Total Revenue" value={summary.totalRevenue} trend={summary.revenueTrend} icon={<TrendingUp size={24} className="text-amber-500" />} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Traffic & Sales Timeline */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Activity vs Ticket Bookings</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Daily breakdown of interest and confirmed orders.</p>
                  </div>
                </div>

                <div className="h-64 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-end justify-between px-6 sm:px-8 py-4 gap-3 sm:gap-6 relative transition-colors duration-300">
                  {timelineData.map((item, i) => (
                    <div key={i} className="flex-1 flex gap-1 sm:gap-2 items-end h-full group relative">
                      <div 
                        className="flex-1 bg-brand-blue/30 dark:bg-brand-blue/40 rounded-t-lg transition-all group-hover:bg-brand-blue" 
                        style={{ height: `${Math.max(item.pageViews, 10)}%` }}
                      />
                      <div 
                        className="flex-1 bg-emerald-500 rounded-t-lg transition-all group-hover:opacity-80 shadow-md shadow-emerald-500/20" 
                        style={{ height: `${Math.max(item.salesHeight, 8)}%` }}
                      />
                      
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        {item.sales} ticket(s)
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-3 text-xs font-bold text-slate-400 dark:text-slate-500 px-4">
                  {timelineData.map((item, i) => (
                    <span key={i}>{item.label}</span>
                  ))}
                </div>

                <div className="flex justify-center mt-6 gap-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-brand-blue/40"></div> Page Activity
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Confirmed Tickets
                  </div>
                </div>
              </div>

              {/* Traffic Sources & Tier Distribution */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors duration-300">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Traffic Channels</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Where your attendees discover events.</p>
                  
                  <div className="space-y-4">
                    {trafficSources.map((source, i) => (
                      <SourceBar key={i} label={source.name} percentage={source.percentage} color={source.color} width={source.width} />
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Ticket Tier Breakdown</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">VIP</p>
                      <p className="text-lg font-black text-purple-600 dark:text-purple-400">{tierDistribution.VIP}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Standard</p>
                      <p className="text-lg font-black text-brand-blue dark:text-blue-400">{tierDistribution.Standard}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Early</p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{tierDistribution.EarlyBird}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Events Table */}
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-900 border dark:border-slate-800 overflow-hidden">
              <CardHeader className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Top Events by Revenue</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Performance ranking across your published events.</p>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {topEvents.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/40 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Event</th>
                        <th className="px-6 py-4">Tickets Sold</th>
                        <th className="px-6 py-4">Gross Revenue</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {topEvents.map((ev) => (
                        <tr key={ev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{ev.title}</td>
                          <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">{ev.ticketsSold} tickets</td>
                          <td className="px-6 py-4 font-black text-brand-blue">{ev.revenue}</td>
                          <td className="px-6 py-4">
                            <Badge className={`border-none text-xs font-bold rounded-full px-3 py-1 ${ev.status === 'Published' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                              {ev.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-slate-400 font-medium">No event data available yet.</div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value, trend, icon }) {
  return (
    <Card className="rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 bg-white dark:bg-slate-900 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">{icon}</div>
        <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-none px-2.5 py-0.5 font-bold text-[10px] rounded-full">{trend}</Badge>
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
    </Card>
  );
}

function SourceBar({ label, percentage, color, width }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1.5">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-slate-900 dark:text-white font-black">{percentage}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} ${width}`}></div>
      </div>
    </div>
  );
}
