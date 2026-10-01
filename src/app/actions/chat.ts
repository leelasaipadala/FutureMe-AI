"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Smart local fallback responses keyed by topic
function getLocalFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("goal") || msg.includes("reach") || msg.includes("achieve")) {
    return `Great question about goals! Here are some strategies that could help:

• **Break it down** — Split your goal into weekly milestones so progress feels tangible.
• **Track consistently** — Use the Goals page to log progress every day.
• **Add a habit** — Goals move faster when backed by daily habits. For example, if your goal is a Senior Engineer role, a "study 2 hrs/day" habit is a powerful accelerator.
• **Run a What-If** — Head to the Simulator to project how small changes compound over months.

What's the specific goal you're working towards? I can give you more tailored advice!`;
  }

  if (msg.includes("habit") || msg.includes("routine") || msg.includes("discipline")) {
    return `Building habits is one of the highest-leverage things you can do. Here's what works:

• **Start tiny** — A 5-minute version of the habit is better than skipping it entirely.
• **Stack habits** — Link new habits to existing ones (e.g., "After I make coffee, I'll open my study material").
• **Track streaks** — Even a 3-day streak creates momentum. Use the Habits page to see yours.
• **Review weekly** — Check your habit completion rate in Analytics to spot friction early.

Which habit are you trying to build or fix?`;
  }

  if (msg.includes("financ") || msg.includes("money") || msg.includes("saving") || msg.includes("budget")) {
    return `Financial discipline is one of the clearest predictors of long-term success. A few thoughts:

• **Automate savings** — Transfer a fixed amount on payday before you can spend it.
• **Track your goals** — The Goals page can help you set a savings milestone with a target date.
• **Cut high-friction expenses** — Eating out, subscriptions you forgot about, and impulse purchases are usually the biggest leaks.
• **Simulate changes** — Run a What-If scenario like "What if I saved ₹15,000 more per month?" to see the compounding impact.

What's your current financial challenge?`;
  }

  if (msg.includes("career") || msg.includes("job") || msg.includes("engineer") || msg.includes("work")) {
    return `Career growth is rarely linear — here's how to accelerate it:

• **Build in public** — Contributing to open source or writing about what you learn makes your growth visible.
• **Deliberate practice** — Study the skills that are actually gatekeeping your next role, not just what's interesting.
• **Timeline it** — Use the Timeline page to set career milestones and track them visually.
• **Network intentionally** — One coffee chat per week with someone in your target role compounds dramatically over a year.

What's the next career milestone you're aiming for?`;
  }

  if (msg.includes("stress") || msg.includes("overwhelm") || msg.includes("burnout") || msg.includes("tired")) {
    return `That's important to acknowledge — burnout can silently derail the best plans. Here are some thoughts:

• **Audit your commitments** — Are you working on too many goals at once? Narrowing to 1-2 primary goals can relieve pressure significantly.
• **Rest is productive** — A proper sleep schedule and exercise habit often double cognitive output.
• **Progress ≠ perfection** — Missing a habit or goal milestone isn't failure — it's data. Adjust and keep moving.
• **Celebrate small wins** — Open the Dashboard and look at what you've already achieved. It's more than you think.

Would you like to talk through a specific stressor?`;
  }

  if (msg.includes("motivat") || msg.includes("procrastinat") || msg.includes("start")) {
    return `Motivation is unreliable — but systems are not. Here's the mindset shift that helps most:

• **Don't wait to feel motivated** — Start for just 2 minutes. Action creates motivation, not the other way around.
• **Design your environment** — Remove friction (put books on your desk) and add friction to distractions (delete social apps from your home screen).
• **Reconnect with your "why"** — Visit your Profile to remind yourself of your long-term goals. Your future self is counting on today's actions.
• **Use deadlines** — Set a target date on your goal in the Goals page. A real deadline changes your behavior.

What's the thing you're avoiding right now?`;
  }

  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("help")) {
    return `Hi there! 👋 I'm your FutureMe AI life coach. I'm here to help you think clearly about:

• 🎯 **Goals** — How to reach them faster
• 💪 **Habits** — How to build and maintain them
• 💰 **Finances** — How to save and plan smarter
• 🚀 **Career** — How to accelerate your trajectory
• 🧠 **Life decisions** — How to think through trade-offs

What would you like to work on today?`;
  }

  // Generic thoughtful response
  return `That's a great thing to reflect on. Here's how I'd think about it through a FutureMe lens:

Every major outcome is the product of small, repeated decisions. The question to ask yourself is: **"If I do this every day for 90 days, where does it lead me?"**

I'd encourage you to:
• **Log it as a habit or goal** on the platform so you can track it intentionally.
• **Run a simulation** in the What-If Simulator to see how this change could reshape your timeline.
• **Check your Analytics** page in 2 weeks — data will tell you if it's working.

Tell me more about what's on your mind and I can give you more specific advice!`;
}

export async function sendChatMessage(
  userMessage: string,
  history: { role: "user" | "model"; text: string }[]
) {
  // Try the real Gemini API first
  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are a supportive, highly intelligent AI assistant embedded inside the "FutureMe AI" application.
    IMPORTANT: All financial values, amounts, and advice MUST be provided in Indian Rupees (INR) formatted with the ₹ symbol. Do NOT use USD or $.
    
    The application helps users set goals, track habits, visualize their future timeline, and simulate "What-If" scenarios. Your role is to help users think clearly about their goals, habits, career trajectory, financial decisions, and personal growth.
Keep answers focused, practical, and under 200 words. Use bullet points when listing things.
Never make guarantees about the future. Frame all projections as "possibilities" or "scenarios".
Always be encouraging and forward-thinking.`,
      });

      const chat = model.startChat({
        history: history.map((h) => ({
          role: h.role,
          parts: [{ text: h.text }],
        })),
      });

      const result = await chat.sendMessage(userMessage);
      const reply = result.response.text();
      return { success: true, reply };
    } catch (error: any) {
      console.error("Chat API error, using local fallback:", error);
      // Fall through to local fallback below
    }
  }

  // Smart local fallback — always works, no network needed
  const reply = getLocalFallbackResponse(userMessage);
  return { success: true, reply };
}
