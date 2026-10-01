"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

async function getUserId() {
  const session = (await cookies()).get("futureme_session");
  return session?.value || null;
}

export async function fetchHabits() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const habits = await prisma.habit.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    return { 
      success: true, 
      habits: habits.map(h => ({
        ...h,
        completedDates: h.completedDates ? JSON.parse(h.completedDates) : [],
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      }))
    };
  } catch (error) {
    console.error("fetchHabits error:", error);
    return { success: false, error: "Failed to fetch habits" };
  }
}

export async function createHabit(data: { title: string, frequency: string }) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const habit = await prisma.habit.create({
      data: {
        userId,
        title: data.title,
        icon: "zap", // default values
        color: "blue", // default values
        frequency: data.frequency,
        currentStreak: 0,
        completedDates: "[]"
      }
    });

    return { 
      success: true, 
      habit: {
        ...habit,
        completedDates: [],
        createdAt: habit.createdAt.toISOString(),
        updatedAt: habit.updatedAt.toISOString(),
      }
    };
  } catch (error) {
    console.error("createHabit error:", error);
    return { success: false, error: "Failed to create habit" };
  }
}

export async function toggleHabitCompletion(id: string, dateStr: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const habit = await prisma.habit.findFirst({ where: { id, userId } });
    
    if (!habit) return { success: false, error: "Habit not found" };

    const targetDate = new Date(dateStr).toDateString();
    
    let completedDates: string[] = [];
    try {
      if (habit.completedDates) {
        completedDates = JSON.parse(habit.completedDates);
      }
    } catch(e) {}
    
    const parsedDates = completedDates.map(d => new Date(d).toDateString());
    const index = parsedDates.indexOf(targetDate);
    
    if (index === -1) {
      // Complete
      completedDates.push(new Date(dateStr).toISOString());
    } else {
      // Uncomplete
      completedDates.splice(index, 1);
    }
    
    await prisma.habit.update({
      where: { id },
      data: { completedDates: JSON.stringify(completedDates) }
    });

    return { success: true };
  } catch (error) {
    console.error("toggleHabitCompletion error:", error);
    return { success: false, error: "Failed to update habit" };
  }
}

export async function deleteHabit(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const habit = await prisma.habit.findFirst({ where: { id, userId } });
    if (!habit) return { success: false, error: "Habit not found" };
    
    await prisma.habit.delete({ where: { id } });
    
    return { success: true };
  } catch (error) {
    console.error("deleteHabit error:", error);
    return { success: false, error: "Failed to delete habit" };
  }
}
