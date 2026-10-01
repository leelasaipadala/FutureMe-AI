import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables");
}

// Initialize the API
const genAI = new GoogleGenerativeAI(apiKey || "dummy-key-for-build");

export async function generateScenarioAnalysis(
  baseline: string,
  adjustments: string[]
) {
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Return mock data if no valid API key is present so the UI doesn't break
    return {
      narrative: `By adding ${adjustments.join(", ")}, you are making meaningful changes to your daily routine. Based on similar trajectories, you can expect noticeable progress in your goals within 3–6 months. Consistency is the key — small daily actions compound into significant results over a year.`,
      scoreIncrease: 10,
      milestones: [
        { title: "Improved daily productivity", impact: "High", timeShift: "-2 months" },
        { title: "Goal progress accelerated", impact: "High", timeShift: "-3 months" },
        { title: "New habits fully formed", impact: "Medium", timeShift: "+1 month" },
      ]
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are the core intelligence of FutureMe AI, an app that predicts and visualizes a user's future based on their goals, habits, and financial data.
    
    IMPORTANT FINANCIAL RULE: All money, currency, savings, and financial projections MUST be expressed in Indian Rupees (INR) using the ₹ symbol (e.g., ₹1,00,000). You MUST use Indian numbering format. DO NOT output USD or $.

    Your task is to analyze the provided baseline data (goals, habits, finance) and a "What-if" scenario.
    Current Baseline Context of the user:
    ${baseline}

    The user is asking: "What if I make these changes?"
    Adjustments:
    ${adjustments.map(a => `- ${a}`).join("\n")}

    Generate a realistic, practical narrative about how these adjustments would change their life trajectory over the next 12 months.
    Also provide an estimated "Progress Score" increase (from 1 to 20).
    Provide the response in the following JSON format ONLY, with no markdown formatting around it:
    {
      "narrative": "Detailed narrative string...",
      "scoreIncrease": 12,
      "milestones": [
        { "title": "Milestone Title", "impact": "High", "timeShift": "e.g. -2 months or +1 month" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting from Gemini response
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating scenario:", error);
    // Graceful fallback for network/parse issues
    return {
      narrative: `By adding ${adjustments.join(", ")}, you are making meaningful changes to your daily routine. Based on similar trajectories, you can expect noticeable progress in your goals within 3–6 months. Consistency is key — small daily actions compound into significant results over a year.`,
      scoreIncrease: 5,
      milestones: [
        { title: "Improved daily productivity", impact: "High", timeShift: "-1 month" },
        { title: "Stronger goal momentum", impact: "Medium", timeShift: "-2 months" },
        { title: "New habits consolidated", impact: "Medium", timeShift: "+2 months" },
      ]
    };
  }
}
