"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Wand2, X, Sparkles, Scale } from "lucide-react";

export default function NewScenarioPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [adjustments, setAdjustments] = useState([
    { type: "habit", value: "Study 1 extra hour a day" },
  ]);
  const [newAdjustment, setNewAdjustment] = useState("");

  const handleAddAdjustment = () => {
    if (newAdjustment.trim()) {
      setAdjustments([...adjustments, { type: "custom", value: newAdjustment }]);
      setNewAdjustment("");
    }
  };

  const handleRemove = (index: number) => {
    setAdjustments(adjustments.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { generateScenarioAction } = await import("@/app/actions/scenario");
      const result = await generateScenarioAction(adjustments.map(a => a.value));
      
      if (result.success && result.data) {
        sessionStorage.setItem("lastScenarioResult", JSON.stringify({
          adjustments: adjustments.map(a => a.value),
          ...result.data
        }));
        router.push("/scenarios/result");
      } else {
        alert("Failed to generate scenario.");
      }
    } catch (e) {
      console.error(e);
      alert("Error calling AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-up">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">What-If Simulator</h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Compare different choices. Add variables to your current life trajectory and let our AI simulate your possible future.
          </p>
        </div>
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
          <Scale className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Input */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400" />
          
          <div>
            <h2 className="text-lg font-bold">Adjust Your Variables</h2>
            <p className="text-xs text-muted-foreground mt-1">What if you changed...</p>
          </div>

          <div className="space-y-3">
            {adjustments.map((adj, i) => (
              <div key={i} className="flex items-center justify-between bg-muted/30 p-3.5 rounded-xl border border-border/60 transition-all hover:border-border">
                <span className="font-semibold text-sm">{adj.value}</span>
                <button 
                  className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-rose-100 hover:text-rose-600 transition-colors" 
                  onClick={() => handleRemove(i)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <label htmlFor="custom" className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
              Add a new adjustment
            </label>
            <div className="flex gap-2">
              <input 
                id="custom" 
                placeholder="e.g. Stop eating out, Learn Rust..." 
                value={newAdjustment}
                onChange={(e) => setNewAdjustment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddAdjustment()}
                className="flex-1 h-11 px-3.5 bg-muted/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
              <button 
                onClick={handleAddAdjustment} 
                className="h-11 px-4 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 border border-border transition-colors flex items-center gap-2 text-sm"
              >
                Add <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={isGenerating || adjustments.length === 0}
            className="w-full h-12 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isGenerating ? (
              <><Sparkles className="w-4 h-4 animate-spin" /> Simulating Future...</>
            ) : (
              <><Wand2 className="w-4 h-4" /> Run Simulation</>
            )}
          </button>
        </div>

        {/* Right Column: Information/Suggestions */}
        <div className="bg-muted/20 rounded-3xl border border-border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold">Suggested Scenarios</h2>
            <p className="text-xs text-muted-foreground mt-1">Try one of these common adjustments</p>
          </div>

          <div className="grid gap-3">
            {[
              "Save an extra ₹15,000 a month",
              "Workout 3 times a week",
              "Read 2 books a month",
              "Switch to a tech career",
              "Wake up at 5 AM daily"
            ].map((suggestion, i) => (
              <button 
                key={i}
                onClick={() => {
                  if (!adjustments.find(a => a.value === suggestion)) {
                    setAdjustments([...adjustments, { type: "suggestion", value: suggestion }]);
                  }
                }}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white hover:border-primary/30 hover:bg-primary/5 transition-all text-left text-sm font-medium group"
              >
                {suggestion}
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-800 mb-1">How it works</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Our AI evaluates your current profile and applies these changes to project a new 12-month timeline, comparing the two side-by-side.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
