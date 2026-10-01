"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchGoals, createGoal, updateGoalProgress as updateGoalProgressAction, deleteGoal } from "@/app/actions/goals";
import { fetchHabits, createHabit, toggleHabitCompletion as toggleHabitCompletionAction, deleteHabit } from "@/app/actions/habits";
import { fetchEvents, createEvent, deleteEvent as deleteEventAction } from "@/app/actions/events";
import { getCurrentUser } from "@/app/actions/auth";

// --- Types (Matched to MongoDB Schema) ---
export type Goal = {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: string;
  priority: string;
  target?: string | null;
  deadline?: string | null;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export type Habit = {
  id: string;
  userId: string;
  title: string;
  icon: string;
  color: string;
  frequency: string;
  currentStreak: number;
  completedDates: string[];
  createdAt: string;
  updatedAt: string;
};

export type CalEvent = {
  id: string;
  userId: string;
  title: string;
  date: string;
  type: string;
  time?: string | null;
  createdAt: string;
  updatedAt: string;
};

type DataContextType = {
  user: { id: string; name: string; email: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ id: string; name: string; email: string } | null>>;
  goals: Goal[];
  habits: Habit[];
  events: CalEvent[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>>;
  addGoal: (goal: any) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  addHabit: (habit: any) => Promise<void>;
  toggleHabitToday: (id: string) => Promise<void>;
  addEvent: (event: any) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  isLoading: boolean;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from MongoDB
  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, goalsRes, habitsRes, eventsRes] = await Promise.all([
          getCurrentUser(),
          fetchGoals(),
          fetchHabits(),
          fetchEvents()
        ]);

        if (userRes) setUser(userRes);
        if (goalsRes.success && goalsRes.goals) setGoals(goalsRes.goals as any);
        if (habitsRes.success && habitsRes.habits) setHabits(habitsRes.habits as any);
        if (eventsRes.success && eventsRes.events) setEvents(eventsRes.events as any);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const addGoal = async (data: any) => {
    const res = await createGoal(data);
    if (res.success && res.goal) {
      setGoals(prev => [res.goal as unknown as Goal, ...prev]);
    }
  };
  
  const updateGoalProgress = async (id: string, progress: number) => {
    // Optimistic update
    setGoals((prev) => prev.map((g) => {
      if (g.id === id) {
        let status = "In Progress";
        if (progress >= 100) status = "Completed";
        if (progress === 0) status = "Not Started";
        return { ...g, progress, status: status as any };
      }
      return g;
    }));
    await updateGoalProgressAction(id, progress);
  };

  const addHabit = async (data: any) => {
    const res = await createHabit(data);
    if (res.success && res.habit) {
      setHabits(prev => [res.habit as unknown as Habit, ...prev]);
    }
  };

  const toggleHabitToday = async (id: string) => {
    const today = new Date().toDateString();
    
    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        
        const completedDates = [...h.completedDates];
        const isCompletedToday = completedDates.some(d => new Date(d).toDateString() === today);
        
        if (isCompletedToday) {
          // Remove today
          const filtered = completedDates.filter(d => new Date(d).toDateString() !== today);
          return { ...h, completedDates: filtered, currentStreak: Math.max(0, h.currentStreak - 1) };
        } else {
          // Add today
          completedDates.push(new Date().toISOString());
          return { ...h, completedDates, currentStreak: h.currentStreak + 1 };
        }
      })
    );

    await toggleHabitCompletionAction(id, new Date().toISOString());
  };

  const addEvent = async (data: any) => {
    const res = await createEvent(data);
    if (res.success && res.event) {
      setEvents(prev => [...prev, res.event as unknown as CalEvent]);
    }
  };

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    await deleteEventAction(id);
  };

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        goals,
        habits,
        events,
        setGoals,
        setHabits,
        setEvents,
        addGoal,
        updateGoalProgress,
        addHabit,
        toggleHabitToday,
        addEvent,
        deleteEvent,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
