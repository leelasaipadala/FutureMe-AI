"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

async function getUserId() {
  const session = (await cookies()).get("futureme_session");
  return session?.value || null;
}

export async function fetchGoals() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const goals = await prisma.goal.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    // Convert Dates to strings for client components
    return { 
      success: true, 
      goals: goals.map(g => ({
        ...g,
        deadline: g.deadline ? g.deadline.toISOString() : undefined,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
      }))
    };
  } catch (error) {
    console.error("fetchGoals error:", error);
    return { success: false, error: "Failed to fetch goals" };
  }
}

export async function createGoal(data: { title: string, description?: string, category: string, priority: string, deadline?: string }) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const goal = await prisma.goal.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        status: "Not Started",
        progress: 0
      }
    });

    return { 
      success: true, 
      goal: {
        ...goal,
        deadline: goal.deadline ? goal.deadline.toISOString() : undefined,
        createdAt: goal.createdAt.toISOString(),
        updatedAt: goal.updatedAt.toISOString(),
      }
    };
  } catch (error) {
    console.error("createGoal error:", error);
    return { success: false, error: "Failed to create goal" };
  }
}

export async function updateGoalProgress(id: string, progress: number) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    let status = "In Progress";
    if (progress >= 100) status = "Completed";
    if (progress === 0) status = "Not Started";

    const goal = await prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) return { success: false, error: "Goal not found" };

    await prisma.goal.update({
      where: { id },
      data: { progress, status },
    });

    return { success: true };
  } catch (error) {
    console.error("updateGoalProgress error:", error);
    return { success: false, error: "Failed to update goal" };
  }
}

export async function deleteGoal(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const goal = await prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) return { success: false, error: "Goal not found" };

    await prisma.goal.delete({ where: { id } });
    
    return { success: true };
  } catch (error) {
    console.error("deleteGoal error:", error);
    return { success: false, error: "Failed to delete goal" };
  }
}
