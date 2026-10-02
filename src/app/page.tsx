import Link from "next/link";
import { ArrowRight, Target, Activity, Sparkles, GitBranch, BarChart2, Leaf, CheckCircle2, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* Soft background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/60 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container relative px-4 md:px-6 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-bold mb-8 shadow-sm">
            <Leaf className="w-3.5 h-3.5" /> AI-Powered Life Design
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl text-balance leading-[1.08]">
            Design your future by
            <span className="text-primary"> understanding </span>
            your choices today.
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Explore possible future outcomes based on your current habits, goals, career, and finances — powered by Gemini AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all text-base">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="#simulator">
              <button className="inline-flex items-center gap-2 border-2 border-border text-foreground font-semibold px-8 py-3.5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all text-base">
                See How It Works
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Free to start</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> AI-powered</span>
          </div>

          {/* App preview mockup */}
          <div className="mt-20 w-full max-w-5xl relative">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl border border-border shadow-2xl p-4 overflow-hidden">
              {/* Mock top bar */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-5 w-48 bg-muted rounded-lg mx-auto" />
              </div>
              {/* Mock dashboard */}
              <div className="flex gap-4">
                <div className="w-32 shrink-0 space-y-1.5">
                  {["Dashboard","Timeline","Goals","Habits","Simulator"].map((l, i) => (
                    <div key={i} className={`px-3 py-1.5 text-[11px] font-bold rounded-lg ${i === 0 ? "bg-primary text-white shadow-sm shadow-primary/30" : "text-muted-foreground hover:bg-muted/50 transition-colors"}`}>
                      {l}
                    </div>
                  ))}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-left">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Health Score</div>
                      <div className="text-xl font-extrabold text-emerald-700">92%</div>
                      <div className="text-[9px] text-emerald-600 mt-1 font-semibold">↑ 4% this week</div>
                    </div>
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-left">
                      <div className="text-[10px] font-bold text-sky-600 uppercase mb-1">Savings Goal</div>
                      <div className="text-xl font-extrabold text-sky-700">₹2.4L</div>
                      <div className="text-[9px] text-sky-600 mt-1 font-semibold">On track for Dec</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-left">
                      <div className="text-[10px] font-bold text-purple-600 uppercase mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Prediction</div>
                      <div className="text-[11px] font-bold text-purple-700 leading-snug mt-1">Job ready in 4 months based on current study habits.</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-border p-4 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs font-bold text-foreground">Future Timeline Projection</div>
                      <div className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Updated Today</div>
                    </div>
                    <div className="relative h-2 w-full bg-muted/40 rounded-full flex items-center">
                      <div className="absolute left-0 h-full w-[45%] bg-gradient-to-r from-primary to-purple-500 rounded-full shadow-sm"></div>
                      <div className="absolute left-[45%] w-3.5 h-3.5 bg-white border-2 border-primary rounded-full -translate-x-1/2 shadow-sm"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-muted-foreground font-semibold">
                      <span>Today</span>
                      <span>Mid-point</span>
                      <span>Goal Reached</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-border rounded-xl p-3 text-left">
                      <div className="text-[10px] font-bold mb-2">Daily Habits</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                          <div className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center shadow-sm"><CheckCircle2 className="w-2.5 h-2.5 text-white"/></div>
                          Read 20 pages
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                          <div className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center shadow-sm"><CheckCircle2 className="w-2.5 h-2.5 text-white"/></div>
                          Code 2 hours
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                          <div className="w-3.5 h-3.5 rounded bg-muted border border-border"></div>
                          Workout 30m
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-left">
                      <div className="text-[10px] font-bold text-amber-700 mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> AI Insight
                      </div>
                      <p className="text-[10px] text-amber-800/90 leading-relaxed mt-1.5 font-medium">
                        You've hit your coding goal 5 days in a row! If you maintain this pace, your skill level will reach "Intermediate" 2 weeks ahead of schedule.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 md:py-28 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">One platform for your entire future</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              FutureMe AI connects your habits, goals, and decisions to show you exactly where each path leads.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Target,     color: "bg-emerald-100 text-emerald-600", title: "Goal Tracking",       desc: "Set meaningful goals and track progress with AI-powered milestone suggestions." },
              { icon: Activity,   color: "bg-sky-100 text-sky-600",         title: "Habit Tracker",       desc: "Build powerful daily habits with 7-day streak tracking and completion rates." },
              { icon: Sparkles,   color: "bg-purple-100 text-purple-600",   title: "AI Life Coach",       desc: "Chat with your personal AI coach anytime — career, finance, habits, mindset." },
              { icon: GitBranch,  color: "bg-amber-100 text-amber-600",     title: "Future Timeline",     desc: "See your compounding life trajectory mapped from today to 1 year ahead." },
              { icon: BarChart2,  color: "bg-rose-100 text-rose-600",       title: "What-If Simulator",   desc: "Change one variable and instantly see how your life trajectory shifts." },
              { icon: Leaf,       color: "bg-emerald-100 text-emerald-600", title: "AI Insights",         desc: "Get weekly AI-generated insights on your patterns, opportunities, and risks." },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three steps to start designing your ideal future.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {[
              { step: "01", icon: "👤", title: "Tell Us About You",     desc: "Share your current education, career, habits, goals, and finances. Takes about 5 minutes." },
              { step: "02", icon: "🔀", title: "Create What-If Scenarios", desc: "Ask questions like 'What if I studied 2 more hours?' and see the projected impact." },
              { step: "03", icon: "🚀", title: "See Your Future Timeline", desc: "Get a clear visual timeline showing how your choices compound over months and years." },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 bg-white rounded-2xl border-2 border-primary/20 flex items-center justify-center mb-5 shadow-sm text-3xl z-10">
                  {icon}
                </div>
                <span className="text-xs font-black text-primary/60 mb-1 uppercase tracking-widest">Step {step}</span>
                <h3 className="font-extrabold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIMULATOR PREVIEW ────────────────────────────────────────────── */}
      <section id="simulator" className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" /> Core Feature
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                The "Change One Decision" Simulator
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Wondering what happens if you save ₹5,000 more a month? Or study 2 extra hours? See the exact long-term impact instantly.
              </p>
              <ul className="space-y-3">
                {["Side-by-side scenario comparison", "Timeline from 1 month to 1 year", "AI insights on trade-offs & risks", "Impact across career, finance & health"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
                  Try the Simulator <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Simulator card preview */}
            <div className="bg-white rounded-2xl border border-border shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold">What-If Simulator</h4>
                <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full border border-primary/20">AI Powered</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-xl p-4 bg-muted/20">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Scenario A</p>
                  <p className="font-bold text-sm">Study 2 hrs/day</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[42%] bg-amber-400 rounded-full" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Job-ready in 9 months</p>
                </div>
                <div className="border-2 border-primary/25 rounded-xl p-4 bg-primary/5">
                  <p className="text-xs text-primary font-semibold mb-1">Scenario B</p>
                  <p className="font-bold text-sm">Study 4 hrs/day</p>
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-primary rounded-full" />
                  </div>
                  <p className="text-[11px] text-primary font-semibold mt-1.5">Job-ready in 5 months ↑</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> AI Insight
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Increasing study time by 2 hrs/day could make you job-ready <strong>4 months earlier</strong>, significantly improving your salary trajectory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-primary/6 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-100/80 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="text-4xl">🌱</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Your future is in<br />your hands.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
                Small daily actions lead to big future changes. Start designing your ideal life today — for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/signup">
                  <button className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all">
                    Start For Free <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="inline-flex items-center gap-2 border-2 border-border font-semibold px-8 py-3.5 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
