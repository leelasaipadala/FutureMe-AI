"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, Check } from "lucide-react";
import { useData } from "@/context/DataContext";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { user, setUser } = useData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name || !email) return;
    setIsSaving(true);
    const res = await updateProfile({ name, email });
    if (res.success && res.user) {
      setUser(res.user);
      toast.success("Profile updated successfully!");
    } else {
      toast.error(res.error || "Failed to update profile");
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-56 shrink-0 flex md:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-muted-foreground"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "account" && (
            <div className="bg-white rounded-3xl border border-border p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Update your personal details here.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Display Name</label>
                  <input id="name" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-3.5 bg-muted/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email Address</label>
                  <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-3.5 bg-muted/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <button onClick={handleSaveProfile} disabled={isSaving} className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-3xl border border-border p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground mt-1">Choose what you want to be notified about.</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Daily Habit Reminders", desc: "Receive push notifications to complete your habits." },
                  { title: "Weekly AI Insights", desc: "Get an email summary of your trajectory optimization." },
                  { title: "Goal Deadlines", desc: "Alerts when a goal deadline is approaching." },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-2xl">
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}




          {activeTab === "security" && (
            <div className="bg-white rounded-3xl border border-border p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold">Security Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your password and authentication.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Current Password</label>
                  <input id="current" type="password" className="w-full h-11 px-3.5 bg-muted/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">New Password</label>
                  <input id="new" type="password" className="w-full h-11 px-3.5 bg-muted/30 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
                <button className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                  Update Password
                </button>
                <button className="text-rose-500 font-bold px-6 py-2.5 rounded-xl hover:bg-rose-50 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
