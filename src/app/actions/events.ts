"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

async function getUserId() {
  const session = (await cookies()).get("futureme_session");
  return session?.value || null;
}

export async function fetchEvents() {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const events = await prisma.event.findMany({ 
      where: { userId },
      orderBy: { date: 'asc' }
    });
    
    return { 
      success: true, 
      events: events.map(e => ({
        ...e,
        date: e.date.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }))
    };
  } catch (error) {
    console.error("fetchEvents error:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

export async function createEvent(data: { title: string, date: string, type: string }) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const event = await prisma.event.create({
      data: {
        userId,
        title: data.title,
        date: new Date(data.date),
        type: data.type
      }
    });

    return { 
      success: true, 
      event: {
        ...event,
        date: event.date.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      }
    };
  } catch (error) {
    console.error("createEvent error:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const event = await prisma.event.findFirst({ where: { id, userId } });
    if (!event) return { success: false, error: "Event not found" };
    
    await prisma.event.delete({ where: { id } });
    
    return { success: true };
  } catch (error) {
    console.error("deleteEvent error:", error);
    return { success: false, error: "Failed to delete event" };
  }
}
