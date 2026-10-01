"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Target, Activity, TrendingUp, Flame, ArrowRight, Edit2, CalendarDays, Sparkles, Plus, Star } from "lucide-react";
import { useData } from "@/context/DataContext";

// ─── Mini Components ─────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent }: any) {
  return (
    <div className="bg-white rounded-3xl border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-125 ${accent}`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accent.replace('bg-', 'bg-').replace('/10', '/20')} shadow-sm border border-white/50`}>
          {icon}
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors group-hover:translate-x-1" />
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black tracking-tight mt-1 mb-1">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">{sub}</p>
      </div>
    </div>
  );
}

function DonutChart({ percent }: { percent: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-sm">
      <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-1000 ease-out" />
      <text x="50" y="56" textAnchor="middle" fontSize="20" fontWeight="900" fill="hsl(var(--foreground))">{percent}%</text>
    </svg>
  );
}

function CircleProgress({ percent, color }: { percent: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 26 26)" />
      <text x="26" y="30" textAnchor="middle" fontSize="10" fontWeight="800" fill="hsl(var(--foreground))">{percent}%</text>
    </svg>
  );
}

function DotProgress({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < filled ? "bg-primary shadow-sm shadow-primary/20" : "bg-muted"}`} />
      ))}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { goals, habits, user } = useData();
  const [timelineView, setTimelineView] = useState<"timeline" | "table">("timeline");

  const userName = user ? user.name.split(" ")[0] : "";

  const goalsCount = goals.length;
  const habitsCount = habits.length;
  const progressScore = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak || 0)) : 0;



  const generateTimeline = () => {
    if (goals.length === 0) return [];
    
    // Simple heuristic to build a timeline from goals
    const sorted = [...goals].filter(g => g.deadline).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
    return sorted.slice(0, 5).map(g => ({
      label: g.title,
      date: new Date(g.deadline!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      bullets: [g.category, `${g.progress}% Complete`, g.description ? (g.description.split(" ")[0] + " " + (g.description.split(" ")[1] || "")) : ""]
    }));
  };

  const timelineSteps = generateTimeline().length > 0 ? generateTimeline() : [
    { label: "Today", date: "Present", bullets: ["Getting started"] }
  ];

  const dotColors = ["bg-primary", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-full animate-fade-up">
      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Here's an overview of your future journey.</p>
          </div>
          <Link href="/scenarios/new">
            <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 w-full sm:w-auto">
              <Sparkles className="w-4 h-4" /> Create New Scenario
            </button>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Target className="w-6 h-6 text-emerald-600" />} label="Goals" value={goalsCount.toString()} sub="Active Goals" accent="bg-emerald-500/10" />
          <StatCard icon={<Flame className="w-6 h-6 text-blue-500" />} label="Habits" value={habitsCount.toString()} sub="Tracking Daily" accent="bg-blue-500/10" />
          <StatCard icon={<TrendingUp className="w-6 h-6 text-amber-500" />} label="Progress Score" value={`${progressScore}%`} sub="Keep going!" accent="bg-amber-500/10" />
          <StatCard icon={<Star className="w-6 h-6 text-rose-500" />} label="Streak" value={maxStreak.toString()} sub="Days in a row" accent="bg-rose-500/10" />
        </div>

        {/* Future Timeline */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-extrabold text-xl">Your Future Timeline</h2>
              <p className="text-sm text-muted-foreground mt-1">See how your current choices shape your future.</p>
            </div>
            <div className="flex bg-muted/50 p-1 rounded-xl shrink-0">
              <button onClick={() => setTimelineView("timeline")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timelineView === "timeline" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Visual
              </button>
              <button onClick={() => setTimelineView("table")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timelineView === "table" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Table
              </button>
            </div>
          </div>

          {timelineView === "timeline" ? (
            <>
              {/* Horizontal timeline */}
              <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-4 min-w-[800px] relative">
                  {/* connecting line */}
                  <div className="absolute top-6 left-12 right-12 h-1 bg-muted z-0 rounded-full" />
                  {timelineSteps.map((step, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center relative z-10">
                      <div className={`w-12 h-12 rounded-2xl ${dotColors[i]} flex items-center justify-center shadow-md mb-4 ring-4 ring-white`}>
                        <span className="text-white text-lg font-bold">{["👤","⭐","✅","🚀","🏆"][i]}</span>
                      </div>
                      <p className="font-extrabold text-sm">{step.label}</p>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4 mt-1 bg-muted px-2 py-0.5 rounded-md">{step.date}</p>
                      <ul className="space-y-2 w-full px-2">
                        {step.bullets.map((b, j) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-start gap-2 bg-muted/30 p-2 rounded-lg border border-border/50">
                            <span className="text-primary font-bold">•</span> <span className="font-medium">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link href="/timeline" className="inline-flex items-center justify-center gap-2 text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors">
                  View Full Timeline <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-bold text-muted-foreground uppercase tracking-wider text-xs">Period</th>
                    <th className="text-left py-3 font-bold text-muted-foreground uppercase tracking-wider text-xs">Milestones</th>
                    <th className="text-left py-3 font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {timelineSteps.map((step, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-bold">{step.label}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {step.bullets.map((b, j) => (
                            <span key={j} className="bg-muted px-2 py-1 rounded-md text-xs font-semibold text-muted-foreground border border-border/50">{b}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4"><span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${i === 0 ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-muted text-muted-foreground border border-border"}`}>{i === 0 ? "Current" : "Projected"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Row: Progress + Habits + Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Overview – computed from real goals */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="font-extrabold mb-6 relative z-10">Progress Overview</h3>
            {(() => {
              const categories = ["Health", "Finance", "Learning", "Career", "Personal"];
              const catColors: Record<string, string> = {
                Health: "bg-emerald-500", Finance: "bg-blue-500",
                Learning: "bg-purple-500", Career: "bg-amber-500", Personal: "bg-rose-400",
              };
              const catData = categories
                .map(cat => {
                  const catGoals = goals.filter(g => g.category === cat);
                  return { label: cat, val: catGoals.length > 0 ? Math.round(catGoals.reduce((s, g) => s + g.progress, 0) / catGoals.length) : 0, color: catColors[cat] };
                })
                .filter(c => c.val > 0)
                .slice(0, 4);
              const overall = catData.length > 0 ? Math.round(catData.reduce((s, c) => s + c.val, 0) / catData.length) : progressScore;
              return catData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Add goals to see your progress breakdown.</p>
              ) : (
                <div className="flex items-center gap-6 mb-2 relative z-10">
                  <DonutChart percent={overall} />
                  <div className="space-y-3 flex-1">
                    {catData.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-md ${item.color} shadow-sm`} />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex-1">{item.label}</span>
                        <span className="text-sm font-extrabold">{item.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Habits Tracker */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold">Habits Tracker</h3>
              <Link href="/habits" className="text-xs text-primary font-bold hover:underline">View all</Link>
            </div>
            <div className="space-y-4 flex-1">
              {habits.slice(0, 3).map((h) => (
                <div key={h.id} className="flex items-center gap-3 bg-muted/20 p-2.5 rounded-xl border border-border/50">
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center border border-border shadow-sm shrink-0">
                    <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-semibold flex-1 truncate">{h.title}</span>
                  <span className="text-xs text-muted-foreground font-bold w-12 text-right bg-white px-1.5 py-0.5 rounded-md border border-border shadow-sm">{h.currentStreak}d</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Goals */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold">Upcoming Goals</h3>
              <Link href="/goals" className="text-xs text-primary font-bold hover:underline">View all</Link>
            </div>
            <div className="space-y-4 flex-1">
              {goals.slice(0, 4).map((g, i) => {
                const colors = [
                  { color: "bg-primary", light: "bg-primary/20" },
                  { color: "bg-blue-500", light: "bg-blue-100" },
                  { color: "bg-amber-500", light: "bg-amber-100" },
                  { color: "bg-rose-500", light: "bg-rose-100" }
                ];
                const theme = colors[i % colors.length];
                return (
                  <div key={g.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold truncate">{g.title}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${theme.light} text-foreground shrink-0`}>{g.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                      <div className={`h-full ${theme.color} rounded-full`} style={{ width: `${g.progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-primary to-violet-500 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-md shadow-primary/20 relative overflow-hidden text-white">

          <div className="flex-1 relative z-10 text-center sm:text-left">
            <h3 className="font-extrabold text-xl md:text-2xl mb-1">Your future is in your hands 🔭</h3>
            <p className="text-white/80 font-medium">Small daily actions lead to monumental future changes.</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <Link href="/goals" className="flex-1 sm:flex-none">
              <button className="w-full flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
                <Target className="w-4 h-4" /> Set Goal
              </button>
            </Link>
            <Link href="/habits" className="flex-1 sm:flex-none">
              <button className="w-full flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Habit
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full xl:w-80 shrink-0 space-y-6">
        {/* What-If Simulator */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="mb-6 relative z-10">
            <h3 className="font-extrabold text-lg">What-If Simulator</h3>
            <p className="text-xs text-muted-foreground mt-1">Compare different choices</p>
          </div>

          {/* Scenario A – based on current habits */}
          <div className="bg-muted/30 border border-border rounded-2xl p-4 mb-4 hover:border-primary/40 transition-colors relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">Scenario A (Current)</p>
              <Link href="/scenarios/new">
                <button className="w-6 h-6 rounded-md bg-white border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground font-semibold mb-4 bg-white inline-block px-2 py-1 rounded-md border border-border shadow-sm">
              {habits.length > 0 ? habits[0].title : "No habits yet"}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-3">6 Months Outcome</p>
            <div className="flex items-center gap-4">
              <CircleProgress percent={progressScore} color="hsl(var(--primary))" />
              <div>
                <p className="font-bold text-sm text-foreground">{progressScore >= 70 ? "Great Progress" : progressScore >= 40 ? "Good Progress" : "Getting Started"}</p>
                <p className="text-xs font-semibold text-muted-foreground">{goalsCount} active goal{goalsCount !== 1 ? "s" : ""} tracked</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 my-2 relative z-10">
            <div className="h-px bg-border flex-1" />
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full border border-border">VS</span>
            <div className="h-px bg-border flex-1" />
          </div>

          {/* Scenario B – improved trajectory */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 hover:border-primary/40 transition-colors relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-primary">Scenario B</p>
              <Link href="/scenarios/new">
                <button className="w-6 h-6 rounded-md bg-white border border-primary/20 shadow-sm flex items-center justify-center text-primary hover:text-primary/80 transition-colors">
                  <Edit2 className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <p className="text-xs text-primary/80 font-semibold mb-4 bg-white inline-block px-2 py-1 rounded-md border border-primary/20 shadow-sm">
              {habits.length > 1 ? habits[1].title : "Add more habits"}
            </p>
            <p className="text-[10px] text-primary/60 uppercase font-bold tracking-wider mb-3">6 Months Outcome</p>
            <div className="flex items-center gap-4">
              <CircleProgress percent={Math.min(100, progressScore + 15)} color="hsl(var(--primary))" />
              <div>
                <p className="font-bold text-sm text-primary">Improved Trajectory</p>
                <p className="text-xs font-semibold text-primary/70">Run simulator for details</p>
              </div>
            </div>
          </div>

          <Link href="/scenarios/new" className="block relative z-10">
            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2">
              Compare Scenarios <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-lg">AI Insights</h3>
            <Link href="/insights" className="text-xs text-primary font-bold hover:underline bg-primary/5 px-2 py-1 rounded-md">View all</Link>
          </div>
          <div className="space-y-3">
            {[
              { emoji: "⚡", text: "You're most consistent with studying.", sub: "Keep it up! Consistency is your superpower.", color: "bg-amber-50" },
              { emoji: "📚", text: "Try increasing study time to 3–4 hrs.", sub: "This could 2x your progress in 6 months.", color: "bg-purple-50" },
              { emoji: "🚀", text: "Focus on building 1 more project.", sub: "Projects will boost your confidence and job opportunities.", color: "bg-emerald-50" },
            ].map((ins, i) => (
              <div key={i} className={`${ins.color} rounded-2xl p-3.5 flex gap-3 border border-black/5`}>
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 text-xl border border-black/5">
                  {ins.emoji}
                </div>
                <div>
                  <p className="text-xs font-bold leading-snug text-foreground/90">{ins.text}</p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-1 leading-snug">{ins.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
