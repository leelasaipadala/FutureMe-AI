"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle, Flame, Activity, X } from "lucide-react";
import { useData } from "@/context/DataContext";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitsPage() {
  const { habits, addHabit, toggleHabitToday } = useData();
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", frequency: "Daily" });

  const categories = ["All", "Daily", "Weekly", "Monthly"];
  const filtered = filter === "All" ? habits : habits.filter(h => h.frequency === filter);
  
  const today = new Date().toDateString();
  const todayDone = habits.filter(h => h.completedDates.some(d => new Date(d).toDateString() === today)).length;
  
  const completionRate = habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0;
  const totalStreak = habits.reduce((s, h) => s + (h.currentStreak || 0), 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak || 0)) : 0;
  const bestHabit = habits.find(h => h.currentStreak === bestStreak)?.title || "None";

  const getWeekDates = () => {
    const dates = [];
    const curr = new Date();
    const day = curr.getDay() || 7; 
    for (let i = 1; i <= 7; i++) {
      const d = new Date(curr);
      d.setDate(curr.getDate() - day + i);
      dates.push(d.toDateString());
    }
    return dates;
  };
  const weekDates = getWeekDates();

  const toggleToday = async (id: string) => {
    await toggleHabitToday(id);
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    await addHabit({
      title: form.title, 
      frequency: form.frequency,
    });
    setForm({ title: "", frequency: "Daily" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Habit Tracker</h1>
          <p className="text-sm text-muted-foreground">Build powerful daily routines that compound over time.</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 shrink-0">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Completion Rate", value: `${completionRate}%`, bg: "bg-emerald-500/10", text: "text-emerald-700" },
          { label: "Today's Done", value: todayDone, bg: "bg-blue-500/10", text: "text-blue-700" },
          { label: "Total Streak", value: totalStreak, bg: "bg-rose-500/10", text: "text-rose-700" },
          { label: "Best Streak", value: bestStreak, bg: "bg-amber-500/10", text: "text-amber-700" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${filter === c ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No habits yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-6">Start building your routine. Small daily habits lead to massive results.</p>
            <button onClick={() => setModalOpen(true)} className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm">
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filtered.map(habit => {
              const isDoneToday = habit.completedDates.some(d => new Date(d).toDateString() === today);
              return (
                <div key={habit.id} className={`bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all ${isDoneToday ? "border-primary/30 ring-1 ring-primary/10" : "border-border"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isDoneToday ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {habit.frequency}
                      </span>
                      <h3 className="font-extrabold text-base mt-2 leading-snug">{habit.title}</h3>
                    </div>
                    <button onClick={() => toggleToday(habit.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-sm ${
                        isDoneToday ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}>
                      {isDoneToday ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-black/5 mb-4">
                    <div className="flex-1 flex items-center gap-2">
                      <Flame className={`w-4 h-4 ${habit.currentStreak > 0 ? "text-rose-500" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-xs font-bold leading-none">{habit.currentStreak} day streak</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    {DAYS.map((day, i) => {
                      const isCompletedThatDay = habit.completedDates.some(d => new Date(d).toDateString() === weekDates[i]);
                      return (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground">{day}</span>
                        <div className={`w-3 h-3 rounded-md shadow-sm ${isCompletedThatDay ? "bg-primary" : "bg-muted border border-border"}`} />
                      </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl border shadow-2xl w-full max-w-md p-6 z-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold tracking-tight">New Habit</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Habit Name *</label>
                <input type="text" placeholder="e.g. Morning Workout" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-3 text-sm border-2 rounded-xl bg-muted/10 outline-none focus:border-primary/50 focus:bg-white transition-all font-medium" autoFocus />
              </div>
              
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Frequency</label>
                <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                  className="w-full px-4 py-3 text-sm border-2 rounded-xl bg-muted/10 outline-none focus:border-primary/50 focus:bg-white transition-all font-medium">
                  {["Daily", "Weekly", "Monthly"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted/80 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={!form.title.trim()} className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all disabled:opacity-50">Add Habit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
