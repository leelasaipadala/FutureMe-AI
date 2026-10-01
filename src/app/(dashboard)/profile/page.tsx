"use client";

import { Briefcase, GraduationCap, Target, User, Wallet, Edit2, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const stored = localStorage.getItem("futureme_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.name) setUserName(user.name);
      } catch (e) {}
    }
  }, []);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">
      {/* Header Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 w-full md:w-auto text-center sm:text-left">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-extrabold text-primary">{initials}</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{userName}</h1>
            <p className="text-muted-foreground font-medium">Junior Developer • New York, USA</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Learner
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold border border-border">
                Onboarding Complete
              </span>
            </div>
          </div>
        </div>
        
        <button className="w-full md:w-auto bg-white border border-border text-foreground font-bold px-5 py-2.5 rounded-xl hover:bg-muted/50 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 relative z-10">
          <Edit2 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-primary" /> Personal
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Age</p>
                <p className="font-bold">25</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                <p className="font-bold">Employed</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Free Time</p>
                <p className="font-bold">15h/week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
              <GraduationCap className="w-5 h-5 text-primary" /> Education
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Level</p>
                <p className="font-bold">Bachelor's</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Field</p>
                <p className="font-bold text-right">Computer<br/>Science</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-primary" /> Daily Habits
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-muted-foreground">Study/Learning</span>
                  <span className="font-bold text-primary">2h/day</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 border border-border/50 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-muted-foreground">Exercise</span>
                  <span className="font-bold text-primary">4h/week</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 border border-border/50 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-muted-foreground">Sleep</span>
                  <span className="font-bold text-primary">7h/night</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 border border-border/50 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-primary/5 to-emerald-50 rounded-3xl border border-primary/20 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-extrabold flex items-center gap-2 text-primary mb-2">
              <Target className="w-6 h-6" /> Future Trajectory Summary
            </h2>
            <p className="text-foreground/80 leading-relaxed font-medium">
              Based on your current habits and goals, you are on track to reach your <span className="font-bold text-primary">Senior Developer</span> target by <span className="font-bold">Q3 next year</span>. Your savings rate is optimal, but increasing exercise consistency will improve long-term outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-primary" /> Career & Skills
              </h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Target Role</p>
                  <p className="font-extrabold text-xl">Senior AI Engineer</p>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Python", "TypeScript", "Node.js"].map(skill => (
                      <span key={skill} className="bg-muted px-2.5 py-1 rounded-md text-xs font-bold border border-border">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Areas to Improve</p>
                  <div className="flex flex-wrap gap-2">
                    {["System Design", "Machine Learning"].map(skill => (
                      <span key={skill} className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border p-6 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Wallet className="w-5 h-5 text-primary" /> Financial Snapshot
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Income</p>
                  <p className="font-extrabold text-xl text-emerald-600">₹4,00,000<span className="text-xs font-semibold text-muted-foreground">/mo</span></p>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Expenses</p>
                  <p className="font-extrabold text-xl text-rose-600">₹2,80,000<span className="text-xs font-semibold text-muted-foreground">/mo</span></p>
                </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-border">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Savings Goal</p>
                    <p className="font-extrabold text-lg">₹16,00,000</p>
                  </div>
                  <p className="text-sm font-bold text-primary">25%</p>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2.5 border border-border/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full" style={{ width: "25%" }} />
                </div>
                <p className="text-xs font-semibold text-muted-foreground text-right mt-2">Saved: ₹4,00,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
