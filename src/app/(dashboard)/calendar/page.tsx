"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, Sparkles, X, Tag } from "lucide-react";

import { useData, CalEvent } from "@/context/DataContext";

type NewEventForm = {
  title: string;
  date: string;
  type: string;
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-300", badge: "bg-emerald-500" },
  blue:    { bg: "bg-blue-50 dark:bg-blue-950",       text: "text-blue-700 dark:text-blue-300",       border: "border-blue-300",    badge: "bg-blue-500" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-950",     text: "text-amber-700 dark:text-amber-300",     border: "border-amber-300",   badge: "bg-amber-500" },
  rose:    { bg: "bg-rose-50 dark:bg-rose-950",       text: "text-rose-700 dark:text-rose-300",       border: "border-rose-300",    badge: "bg-rose-500" },
  purple:  { bg: "bg-purple-50 dark:bg-purple-950",   text: "text-purple-700 dark:text-purple-300",   border: "border-purple-300",  badge: "bg-purple-500" },
};

const CATEGORIES = ["Goal", "Habit", "Reminder", "Other"];
const CAT_COLORS: Record<string, string> = {
  Goal: "emerald", Habit: "blue", Reminder: "amber", Other: "purple"
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const { events, addEvent, deleteEvent } = useData();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [form, setForm] = useState<NewEventForm>({
    title: "", date: "", type: "Reminder"
  });

  // Grid calculation
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday-first

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const goToday = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); };

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const dayEvents = (day: number) => events.filter(e => {
    const d = new Date(e.date);
    return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const closeModal = () => setModalOpen(false);

  const openNewEvent = (day?: number) => {
    setSelectedEvent(null);
    setSelectedDay(day || null);
    setForm({
      title: "", date: day ? String(day) : "", type: "Reminder"
    });
    setModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!form.title.trim()) return;
    const d = new Date(currentYear, currentMonth, parseInt(form.date) || selectedDay || 1);
    await addEvent({
      date: d.toISOString(),
      title: form.title,
      type: form.type,
    });
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    setSelectedEvent(null);
  };

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter(e => new Date(e.date).getTime() >= todayStart.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Schedule your future, one day at a time.</p>
        </div>
        <button
          onClick={() => openNewEvent()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* ── Left Sidebar ── */}
        <div className="space-y-4">
          {/* Upcoming */}
          <div className="bg-background rounded-2xl border p-4 shadow-sm">
            <h3 className="font-bold mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              ) : upcomingEvents.map(ev => {
                const colorKey = CAT_COLORS[ev.type] || "emerald";
                const c = COLOR_MAP[colorKey];
                const d = new Date(ev.date);
                return (
                  <button key={ev.id} onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left p-3 rounded-xl border ${c.bg} ${c.border} hover:shadow-sm transition-all`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-semibold text-xs leading-snug ${c.text}`}>{ev.title}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{d.getDate()} {MONTH_NAMES[d.getMonth()]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories legend */}
          <div className="bg-background rounded-2xl border p-4 shadow-sm">
            <h3 className="font-bold text-sm mb-3">Categories</h3>
            <div className="space-y-2">
              {Object.entries(CAT_COLORS).map(([cat, col]) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${COLOR_MAP[col]?.badge}`} />
                  <span className="text-xs text-muted-foreground">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Calendar Grid ── */}
        <div className="lg:col-span-3">
          <div className="bg-background rounded-2xl border shadow-sm overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-black">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={goToday} className="px-3 py-1 text-xs font-semibold bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  Today
                </button>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {days.map(d => (
                <div key={d} className="py-2.5 text-center text-xs font-semibold text-muted-foreground">{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7">
              {/* Empty offset */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`e-${i}`} className="min-h-[90px] border-r border-b bg-muted/10" />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const evs = dayEvents(day);
                const today_ = isToday(day);
                return (
                  <div key={day}
                    onClick={() => openNewEvent(day)}
                    className="min-h-[90px] p-1.5 border-r border-b hover:bg-muted/20 cursor-pointer transition-colors relative group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                        today_ ? "bg-primary text-primary-foreground" : "text-foreground group-hover:text-primary"
                      }`}>
                        {day}
                      </span>
                      {evs.length === 0 && (
                        <Plus className="w-3 h-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {evs.slice(0, 2).map(ev => {
                        const colorKey = CAT_COLORS[ev.type] || "emerald";
                        const c = COLOR_MAP[colorKey];
                        return (
                          <button key={ev.id}
                            onClick={e => { e.stopPropagation(); setSelectedEvent(ev); }}
                            className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded font-medium truncate ${c.bg} ${c.text} border ${c.border} hover:opacity-90`}>
                            {ev.title}
                          </button>
                        );
                      })}
                      {evs.length > 2 && (
                        <p className="text-[10px] text-muted-foreground pl-1">+{evs.length - 2} more</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Trailing empty cells */}
              {Array.from({ length: (7 - ((startOffset + daysInMonth) % 7)) % 7 }).map((_, i) => (
                <div key={`t-${i}`} className="min-h-[90px] border-r border-b bg-muted/10" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── New Event Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-background rounded-2xl border shadow-2xl w-full max-w-md p-6 z-10 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black">New Event</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Study Node.js, Gym Session..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  autoFocus
                />
              </div>

              {/* Date + Category row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Day *</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    min={1} max={daysInMonth}
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Category</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-muted/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 border py-2.5 rounded-xl text-sm font-semibold hover:bg-muted/60 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveEvent} disabled={!form.title.trim() || !form.date}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Event Detail Modal ── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-background rounded-2xl border shadow-2xl w-full max-w-sm p-5 z-10 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}>
            {(() => {
              const colorKey = CAT_COLORS[selectedEvent.type] || "emerald";
              const c = COLOR_MAP[colorKey];
              const d = new Date(selectedEvent.date);
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
                      {selectedEvent.type}
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-lg hover:bg-muted/60 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="text-lg font-black mb-3">{selectedEvent.title}</h2>
                  <div className="space-y-2 mb-5">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4 shrink-0" /> Day {d.getDate()}, {MONTH_NAMES[d.getMonth()]} {d.getFullYear()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedEvent(null)}
                      className="flex-1 border py-2 rounded-xl text-sm font-semibold hover:bg-muted/60 transition-colors">
                      Close
                    </button>
                    <button onClick={() => handleDelete(selectedEvent.id)}
                      className="flex-1 bg-rose-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
