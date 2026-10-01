"use client";

import { Sparkles, TrendingUp, AlertCircle, Lightbulb, Clock, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function InsightsPage() {
  const { goals, habits, isLoading } = useData();

  // Basic dynamic calculations
  const totalHabits = habits.length;
  const today = new Date().toDateString();
  const completedToday = habits.filter(h => h.completedDates.some(d => new Date(d).toDateString() === today)).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  const bestHabit = habits.length > 0 && habits.some(h => (h.currentStreak || 0) > 0) 
    ? [...habits].sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0))[0] 
    : null;
  const topGoal = goals.length > 0 ? [...goals].sort((a, b) => b.progress - a.progress)[0] : null;

  const optimizationScore = Math.max(10, Math.round((completionRate * 0.6) + ((topGoal?.progress || 0) * 0.4)));

  const getWeekRange = () => {
    const todayDate = new Date();
    const day = todayDate.getDay() || 7; 
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() - day + 1);
    const sunday = new Date(todayDate);
    sunday.setDate(todayDate.getDate() - day + 7);
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };
  const weekRange = getWeekRange();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground font-medium">Analyzing your trajectory...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-2">
            AI Insights <Sparkles className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Personalized analysis of your trajectory and habits based on your weekly performance.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-muted/50 border border-border text-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm shrink-0">
          <Clock className="w-4 h-4" /> Past Reviews
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-6 md:p-8 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white text-primary border border-primary/20 shadow-sm self-start">
                  Weekly Review
                </span>
                <span className="text-xs text-muted-foreground font-bold">{weekRange}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-primary mb-3">
                {completionRate >= 80 ? "You are gaining momentum!" : completionRate >= 50 ? "Steady progress this week." : "Let's pick up the pace!"}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                This week, you maintained a <strong className="text-foreground">{completionRate}% completion rate</strong> on your daily habits. 
                {bestHabit ? (
                  <> Your consistency in <strong className="text-foreground">"{bestHabit.title}"</strong> is directly accelerating your timeline towards {topGoal ? `"${topGoal.title}"` : "your goals"}.</>
                ) : (
                  <> Try to build a consistent routine to accelerate your timeline towards {topGoal ? `"${topGoal.title}"` : "your goals"}.</>
                )}
              </p>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h4 className="font-bold flex items-center gap-2 text-emerald-800 mb-2 relative z-10">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> What's Working
                </h4>
                <p className="text-sm text-emerald-700/90 leading-relaxed relative z-10">
                  {bestHabit ? `Your discipline with "${bestHabit.title}" is excellent. You've hit a ${bestHabit.currentStreak}-day streak!` : "You're at the starting line. Every big achievement starts with a single step today!"}
                </p>
              </div>
              
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h4 className="font-bold flex items-center gap-2 text-amber-800 mb-2 relative z-10">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Areas of Friction
                </h4>
                <p className="text-sm text-amber-700/90 leading-relaxed relative z-10">
                  {completionRate < 100 ? "You missed a few habits today. Consistency often correlates strongly with sustained cognitive performance and goal achievement." : "Perfect completion! No areas of friction detected right now."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-extrabold flex items-center gap-2 mb-1">
                <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-500/20" /> Opportunities
              </h3>
              <p className="text-sm text-muted-foreground">Small adjustments that could yield high leverage.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-muted/20 rounded-2xl border border-border gap-4 hover:border-primary/30 transition-colors group">
                <div>
                  <h4 className="font-bold text-foreground">Shift workout to mornings</h4>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Data suggests your evening energy is low, causing missed workouts. Moving them to 7 AM could increase consistency by 40%.</p>
                </div>
                <button className="shrink-0 bg-white border border-border text-foreground font-semibold px-4 py-2 rounded-xl text-sm shadow-sm hover:text-primary hover:border-primary/30 transition-all">
                  Simulate Impact
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-muted/20 rounded-2xl border border-border gap-4 hover:border-primary/30 transition-colors group">
                <div>
                  <h4 className="font-bold text-foreground">Combine reading and commute</h4>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Listening to audiobooks during your 30m commute can help you hit your reading goal without adding extra time to your day.</p>
                </div>
                <button className="shrink-0 bg-white border border-border text-foreground font-semibold px-4 py-2 rounded-xl text-sm shadow-sm hover:text-primary hover:border-primary/30 transition-all">
                  Simulate Impact
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-wider mb-4">Optimization Score</h3>
            <div className="text-6xl font-black text-primary mb-3">{optimizationScore}<span className="text-2xl text-muted-foreground/50">/100</span></div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {optimizationScore >= 80 ? "Your current routine is highly optimized for your selected goals. Keep up the great work!" : optimizationScore >= 50 ? "Your routine is fairly optimized, but there's room for improvement." : "Focus on consistency to improve your routine's alignment with your goals."}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-8">
            <h3 className="font-extrabold text-lg mb-5">Next Steps</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Complete pending habits</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
              <div className="h-px w-full bg-border" />
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Review budget for this week</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
