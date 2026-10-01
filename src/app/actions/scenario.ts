"use server";

import { generateScenarioAnalysis } from "@/lib/gemini";

export async function generateScenarioAction(adjustments: string[]) {
  // In a full app, we would fetch the user's actual baseline from the database
  // For now, we use a mocked baseline
  const mockedBaseline = `
    Age: 25. Status: Employed as Junior Developer.
    Goals: Senior AI Engineer, ₹10,00,000 Emergency Fund.
    Habits: Study 2 hrs/day, Exercise 4x/week.
  `;

  try {
    const result = await generateScenarioAnalysis(mockedBaseline, adjustments);
    
    // Here we would typically save the result to the Scenario collection in MongoDB
    // const newScenario = await Scenario.create({...})

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Action error:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
