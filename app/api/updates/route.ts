// app/api/updates/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ summary: ["Dev forgot the keys... but the app is running! 🔑"] });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // --- FIX IS HERE ---
    // Try "gemini-1.5-flash-latest". 
    // If this still 404s, switch this string to "gemini-pro"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const { rawUpdates } = await req.json();

    if (!rawUpdates) {
      return NextResponse.json({ summary: ["Making things shiny and new! ✨"] });
    }

    const prompt = `
      Role: You are the witty, friendly Community Manager for a housing app called "212 May Street".
      Input: "${rawUpdates}"
      Task: Translate these technical updates into a maximum of 3 fun, tenant-friendly bullet points.
      Guidelines:
      1. IGNORE: Merge commits, "wip", "typo fixes", "refactor", "config".
      2. HIGHLIGHT: UI changes, new features, bug fixes.
      3. TONE: Casual, using emojis.
      4. FALLBACK: If purely technical, return: "General housekeeping to keep the app running smoothly! 🧹"
      Output: ONLY bullet points, separated by newlines.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const bulletPoints = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[\*\-]\s*/, ''));

    return NextResponse.json({ summary: bulletPoints });

  } catch (error) {
    console.error("Gemini Error:", error);
    // Return a safe fallback so the frontend doesn't crash
    return NextResponse.json({ summary: ["Just doing some spring cleaning in the code! 🧹"] });
  }
}