"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Save, RotateCcw, Target, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { createGoal } from "@/app/actions/goals";

export default function ScenarioResultPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adopted, setAdopted] = useState(false);
  const [adopting, setAdopting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("lastScenarioResult");
    if (data) {
      setResult(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const handleAdopt = async () => {
    setAdopting(true);
    try {
      for (const adj of result.adjustments) {
        const res = await createGoal({
          title: adj,
          description: `Adopted from What-If Scenario: ${adj}`,
          category: "Personal",
          priority: "Medium",
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        });
        if (!res.success) {
          throw new Error(res.error || "Failed to create goal");
        }
      }
      setAdopted(true);
      sessionStorage.removeItem("lastScenarioResult");
      setTimeout(() => router.push("/goals"), 1500);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to adopt scenario. Please try again.");
    } finally {
      setAdopting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Simulating future...</div>;
  
  if (!result) return (
    <div className="p-12 text-center space-y-4 max-w-md mx-auto bg-white rounded-3xl border border-border shadow-sm mt-10">
      <h2 className="text-xl font-bold">No scenario data found.</h2>
      <p className="text-sm text-muted-foreground mb-4">Please run a simulation first to see the results.</p>
      <Link href="/scenarios/new">
        <button className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all">
          Go back to Simulator
        </button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2 border border-primary/20 shadow-sm">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Scenario Projected</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here is how your future changes based on your new adjustments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Narrative & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-xl font-extrabold text-primary flex items-center gap-2 mb-1">
                    New Trajectory Simulation
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">Confidence: <span className="text-primary font-bold">High</span></p>
                </div>
              </div>
              <div className="mt-5 space-y-2 relative z-10">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Simulated Adjustments:</p>
                {result.adjustments.map((a: string, i: number) => (
                  <div key={i} className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-border text-sm font-semibold shadow-sm mr-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> {a}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-8">
              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
                <p>{result.narrative}</p>
              </div>

              <div>
                <h4 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Target className="w-5 h-5 text-primary" /> Adjusted Milestones
                </h4>
                <div className="space-y-3">
                  {result.milestones?.map((m: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 p-4 rounded-2xl border border-border gap-3">
                      <span className="font-semibold text-sm">{m.title}</span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
                        {m.timeShift}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/timeline" className="flex-1">
              <button className="w-full bg-white border border-border text-foreground font-bold py-3.5 rounded-2xl hover:bg-muted/50 transition-all flex items-center justify-center gap-2 shadow-sm">
                <Calendar className="w-4 h-4" /> View Adjusted Timeline
              </button>
            </Link>
            <button
              onClick={handleAdopt}
              disabled={adopting || adopted}
              className="flex-1 bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {adopted ? (
                <><CheckCircle className="w-4 h-4" /> Scenario Adopted! Redirecting...</>
              ) : adopting ? (
                <><Save className="w-4 h-4 animate-spin" /> Adopting...</>
              ) : (
                <><Save className="w-4 h-4" /> Adopt This Scenario</>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Comparison */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
            <h3 className="font-extrabold text-lg mb-6">Scenario Comparison</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-semibold">Baseline Progress Score</span>
                  <span className="font-bold">78</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden border border-border/50">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-primary font-bold">New Scenario Score</span>
                  <span className="font-extrabold text-primary text-lg leading-none">{78 + (result.scoreIncrease || 0)}</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2.5 relative border border-border/50">
                  <div className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, 78 + (result.scoreIncrease || 0))}%` }}></div>
                  <div className="absolute top-0 bottom-0 left-[78%] border-l-2 border-dashed border-white"></div>
                </div>
                <p className="text-xs text-emerald-600 text-right font-bold mt-2">+{result.scoreIncrease || 0} point increase 🚀</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-3xl border border-border p-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Want to see how other choices play out? Try adjusting different variables.
            </p>
            <Link href="/scenarios/new" className="block">
              <button className="w-full bg-white border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted/80 transition-all flex items-center justify-center gap-2 shadow-sm">
                <RotateCcw className="w-4 h-4" /> Run Another Simulation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
