"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function login(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Set cookie session (simple auth)
    (await cookies()).set("futureme_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function signup(name: string, email: string) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return { success: false, error: "User already exists with this email" };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        onboardingCompleted: false,
      }
    });

    // Set cookie session
    (await cookies()).set("futureme_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function logout() {
  (await cookies()).delete("futureme_session");
  return { success: true };
}

export async function getCurrentUser() {
  try {
    const session = (await cookies()).get("futureme_session");
    if (!session?.value) return null;

    const user = await prisma.user.findUnique({ where: { id: session.value } });
    
    if (!user) return null;

    return { id: user.id, name: user.name, email: user.email, onboardingCompleted: user.onboardingCompleted };
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
