import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { emailText } = await req.json();

  if (!emailText) {
    return NextResponse.json({ error: "Missing email text" }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a sales expert providing feedback on sales emails.",
        },
        {
          role: "user",
          content: `Provide feedback on this sales email, keep your response short and concise and purely informational:\n\n${emailText}`,
        },
      ],
    });

    const suggestions = response.choices[0].message.content;
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
