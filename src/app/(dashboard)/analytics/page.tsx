"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, Target, Activity, Zap, Calendar } from "lucide-react";

const trajectoryData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 74 },
  { month: "Apr", score: 72 },
  { month: "May", score: 79 },
  { month: "Jun", score: 85 },
];

const habitsData = [
  { day: "Mon", completed: 4 },
  { day: "Tue", completed: 5 },
  { day: "Wed", completed: 3 },
  { day: "Thu", completed: 5 },
  { day: "Fri", completed: 4 },
  { day: "Sat", completed: 2 },
  { day: "Sun", completed: 6 },
];

const goalsData = [
  { name: "Career", value: 40 },
  { name: "Finance", value: 30 },
  { name: "Health", value: 20 },
  { name: "Skills", value: 10 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Progress Analytics</h1>
          <p className="text-sm text-muted-foreground">Visualize your journey and track your trajectory over time.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-muted/50 border border-border text-foreground font-semibold px-4 py-2 rounded-xl text-sm shrink-0">
          <Calendar className="w-4 h-4 text-muted-foreground" /> Last 6 Months
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Trajectory Score</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-4xl font-black text-foreground">85<span className="text-2xl text-muted-foreground/50">/100</span></div>
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +6 points since last month
          </p>
        </div>
        
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Goal Completion</h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="text-4xl font-black text-foreground">42%</div>
          <p className="text-xs font-semibold text-muted-foreground mt-2">
            Average across all categories
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-emerald-50 rounded-3xl border border-primary/20 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wider">AI Optimization</h3>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-primary">High Synergy</div>
          <p className="text-xs font-semibold text-primary/80 mt-2">
            Your habits strongly align with your goals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trajectory Chart */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold">Future Trajectory Over Time</h3>
            <p className="text-sm text-muted-foreground mt-1">How your overall progress score has evolved.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} 
                  dx={-10} 
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: 'hsl(var(--primary))' }} 
                  activeDot={{ r: 7, fill: 'hsl(var(--primary))', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habits Consistency Bar Chart */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Weekly Habits
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Number of habits completed per day.</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitsData} margin={{ top: 5, right: 0, bottom: 5, left: -30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} 
                />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Breakdown Pie Chart */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Goal Focus
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Distribution of active goals by category.</p>
          </div>
          <div className="h-[250px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goalsData}
                  cx="40%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {goalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {goalsData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2.5 text-sm">
                  <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-bold text-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
