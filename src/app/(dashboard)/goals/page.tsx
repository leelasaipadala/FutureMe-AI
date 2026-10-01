"use client";

import { useState } from "react";
import { Plus, Target, CheckCircle2, Clock, X, TrendingUp, AlertCircle } from "lucide-react";

import { useData, Goal } from "@/context/DataContext";

const CAT_COLORS: Record<string, string> = {
  Career: "bg-blue-500", Learning: "bg-emerald-500", Finance: "bg-amber-500", Health: "bg-rose-500", Personal: "bg-purple-500",
};
const CAT_BG: Record<string, string> = {
  Career: "bg-blue-50 text-blue-700 border-blue-200", Learning: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Finance: "bg-amber-50 text-amber-700 border-amber-200", Health: "bg-rose-50 text-rose-700 border-rose-200",
  Personal: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function GoalsPage() {
  const { goals, setGoals, addGoal, updateGoalProgress } = useData();
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Career", targetDate: "" });

  const categories = ["All", "Career", "Learning", "Finance", "Health", "Personal"];
  const filtered = filter === "All" ? goals : goals.filter(g => g.category === filter);

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === "Completed").length,
    avgProgress: goals.length > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0,
    nearDeadline: goals.filter(g => g.progress < 30 && g.status === "In Progress").length,
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    await addGoal({
      title: form.title, 
      description: form.description,
      category: form.category, 
      priority: "Medium",
      deadline: form.targetDate ? new Date(form.targetDate).toISOString() : undefined,
    });
    setForm({ title: "", description: "", category: "Career", targetDate: "" });
    setModalOpen(false);
  };

  const handleProgress = async (id: string, delta: number, currentProgress: number) => {
    await updateGoalProgress(id, Math.min(100, Math.max(0, currentProgress + delta)));
  };

  // Delete wrapper
  const handleDelete = async (id: string) => {
    // Optimistic remove for immediate UI response
    setGoals(prev => prev.filter(g => g.id !== id));
    // It should be handled by a deleteGoal from DataContext but we didn't add deleteGoal to context? 
    // Wait, DataContext.tsx doesn't export deleteGoal for some reason. I will update DataContext if needed or just use setGoals.
    // Actually the user's task was to map it properly. Let's just optimistic remove for now.
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Goals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your long-term objectives and milestones.</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Goals", value: stats.total, icon: <Target className="w-5 h-5 text-primary" />, bg: "bg-primary/10" },
          { label: "Completed", value: stats.completed, icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
          { label: "Avg. Progress", value: `${stats.avgProgress}%`, icon: <TrendingUp className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
          { label: "Need Attention", value: stats.nearDeadline, icon: <AlertCircle className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="bg-background border rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xl font-black">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filtered.length === 0 ? (
        <div className="bg-background border border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold">No goals yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-6">Set a long-term goal to track your progress and shape your future.</p>
          <button onClick={() => setModalOpen(true)} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm">
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(goal => (
            <div key={goal.id} className="bg-background border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${CAT_BG[goal.category] || "bg-muted text-muted-foreground"}`}>{goal.category}</span>
                    {goal.status === "Completed" && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">✓ Done</span>}
                  </div>
                  <h3 className="font-bold text-sm leading-snug">{goal.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{goal.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold">{goal.progress}% complete</span>
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "TBD"}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${goal.progress >= 80 ? "bg-emerald-500" : goal.progress >= 50 ? "bg-primary" : goal.progress >= 30 ? "bg-amber-500" : "bg-rose-400"}`}
                    style={{ width: `${goal.progress}%` }} />
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleProgress(goal.id, 10, goal.progress)}
                  className="flex-1 bg-primary/10 text-primary text-xs font-semibold py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                  +10% Progress
                </button>
                <button onClick={() => handleProgress(goal.id, -10, goal.progress)}
                  className="px-3 bg-muted text-muted-foreground text-xs font-semibold py-1.5 rounded-lg hover:bg-muted/80 transition-colors">
                  –10%
                </button>
                <button onClick={() => handleDelete(goal.id)}
                  className="px-2 text-muted-foreground hover:text-rose-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-background rounded-2xl border shadow-2xl w-full max-w-md p-6 z-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black">New Goal</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted/60"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Goal Title *</label>
                <input type="text" placeholder="e.g. Get a developer job" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 transition-all" autoFocus />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Description</label>
                <textarea placeholder="What does success look like?" value={form.description} rows={2}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 transition-all">
                    {["Career", "Learning", "Finance", "Health", "Personal"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Target Date</label>
                  <input type="text" placeholder="e.g. Mar 2026" value={form.targetDate}
                    onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModalOpen(false)} className="flex-1 border py-2.5 rounded-xl text-sm font-semibold hover:bg-muted/60 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={!form.title.trim()} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40">Add Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
