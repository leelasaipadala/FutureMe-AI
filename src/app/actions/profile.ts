"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function updateProfile(data: { name?: string; email?: string }) {
  try {
    const session = await getCurrentUser();
    if (!session) return { success: false, error: "Unauthorized" };

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();

    const user = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
    });
    
    if (!user) return { success: false, error: "User not found" };

    return { 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email } 
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Internal server error" };
  }
}
