"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Telescope, Sparkles } from "lucide-react";

const STEPS = [
  { id: "personal", title: "Personal Details" },
  { id: "education", title: "Education" },
  { id: "career", title: "Career & Skills" },
  { id: "finance", title: "Finances" },
  { id: "habits", title: "Daily Habits" },
  { id: "preferences", title: "Preferences" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    personal: { age: "", location: "", currentStatus: "" },
    education: { level: "", degree: "", field: "", academicStatus: "" },
    career: { currentCareer: "", targetCareer: "", targetRole: "", experience: "", skills: "" },
    finance: { monthlyIncome: "", monthlyExpenses: "", savings: "", savingsGoal: "", financialGoals: "" },
    habits: { studyTimeHours: "", learningTimeHours: "", exerciseHours: "", sleepHours: "", readingHours: "" },
    preferences: { mainPriorities: "", availableTimeHours: "", riskTolerance: "", areasToImprove: "" },
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const renderField = (
    stepId: keyof typeof formData,
    field: string,
    label: string,
    placeholder: string,
    type = "text",
    options?: string[]
  ) => {
    const value = (formData[stepId] as any)[field];
    const onChange = (e: any) =>
      setFormData({
        ...formData,
        [stepId]: { ...formData[stepId], [field]: e.target.value },
      });

    return (
      <div className="space-y-2 w-full">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
        {options ? (
          <div className="relative">
            <select
              value={value}
              onChange={onChange}
              className="w-full h-11 px-3.5 bg-muted/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none"
            >
              <option value="" disabled>Select {label.toLowerCase()}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full h-11 px-3.5 bg-muted/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.006_120)] flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between relative z-10 border-b border-border bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/30">
            <Telescope className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <p className="font-extrabold text-sm leading-none text-foreground">FutureMe AI</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground mr-2">Progress</span>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  i < currentStep ? "bg-primary" : i === currentStep ? "bg-primary w-10" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-border p-6 md:p-10 shadow-xl shadow-border/50 animate-fade-up">
          
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              {STEPS[currentStep].title}
            </h1>
            <p className="text-muted-foreground text-sm">
              Step {currentStep + 1} of {STEPS.length} — Help AI understand your current trajectory.
            </p>
          </div>

          <div className="min-h-[300px]">
            {currentStep === 0 && (
              <div className="grid sm:grid-cols-2 gap-5 animate-scale-in">
                {renderField("personal", "age", "Age", "e.g. 24", "number")}
                {renderField("personal", "location", "City / Country", "e.g. Bangalore, India")}
                <div className="sm:col-span-2">
                  {renderField("personal", "currentStatus", "Current Status", "Select status", "text", ["Student", "Working Professional", "Looking for Job", "Freelancer", "Other"])}
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="grid sm:grid-cols-2 gap-5 animate-scale-in">
                {renderField("education", "level", "Highest Education Level", "Select level", "text", ["High School", "Bachelor's", "Master's", "PhD", "Self-Taught", "Other"])}
                {renderField("education", "degree", "Degree / Certification", "e.g. B.Tech in CS")}
                {renderField("education", "field", "Field of Study", "e.g. Computer Science")}
                {renderField("education", "academicStatus", "Academic Status", "Select status", "text", ["Currently Enrolled", "Graduated", "Dropped Out"])}
              </div>
            )}
            {currentStep === 2 && (
              <div className="grid sm:grid-cols-2 gap-5 animate-scale-in">
                {renderField("career", "currentCareer", "Current Role / Industry", "e.g. Junior Web Developer")}
                {renderField("career", "targetCareer", "Target Future Role", "e.g. Senior Full Stack Engineer")}
                {renderField("career", "experience", "Years of Experience", "e.g. 2", "number")}
                <div className="sm:col-span-2">
                  {renderField("career", "skills", "Top Skills (Comma separated)", "e.g. JavaScript, React, Node.js")}
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="grid sm:grid-cols-2 gap-5 animate-scale-in">
                {renderField("finance", "monthlyIncome", "Monthly Income (Approx)", "e.g. ₹40,000", "number")}
                {renderField("finance", "monthlyExpenses", "Monthly Expenses (Approx)", "e.g. ₹25,000", "number")}
                {renderField("finance", "savings", "Current Total Savings", "e.g. ₹1,00,000", "number")}
                <div className="sm:col-span-2">
                  {renderField("finance", "financialGoals", "Main Financial Goal", "Select goal", "text", ["Build Emergency Fund", "Buy a House", "Invest in Stocks/Crypto", "Pay off Debt", "Retire Early"])}
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="grid sm:grid-cols-2 gap-5 animate-scale-in">
                {renderField("habits", "studyTimeHours", "Weekly Study/Skill Time (Hours)", "e.g. 10", "number")}
                {renderField("habits", "exerciseHours", "Weekly Exercise (Hours)", "e.g. 4", "number")}
                {renderField("habits", "sleepHours", "Average Sleep per Night (Hours)", "e.g. 7", "number")}
                {renderField("habits", "readingHours", "Weekly Reading (Hours)", "e.g. 2", "number")}
              </div>
            )}
            {currentStep === 5 && (
              <div className="grid sm:grid-cols-2 gap-5 animate-scale-in">
                <div className="sm:col-span-2">
                  {renderField("preferences", "mainPriorities", "What's your #1 priority right now?", "Select priority", "text", ["Career Growth", "Financial Independence", "Health & Fitness", "Work-Life Balance", "Learning New Skills"])}
                </div>
                {renderField("preferences", "availableTimeHours", "Free time per week for new habits?", "e.g. 15", "number")}
                {renderField("preferences", "riskTolerance", "Risk Tolerance for Career/Finance", "Select risk", "text", ["Low (Prefer Stability)", "Medium (Calculated Risks)", "High (Aggressive Growth)"])}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back
            </button>

            {currentStep === STEPS.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" /> Generating Future...
                  </>
                ) : (
                  <>
                    Complete Setup <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center gap-2"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
