import { openai } from "@/lib/chatGPT";

export const getWebsite = async (company: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert on companies and what they do.",
        },
        {
          role: "user",
          content: `Find the website of ${company}. **Important**: Only reply with the website URL.`,
        },
      ],
    });
    if (!response.choices[0].message.content) {
      throw new Error("Failed to fetch company relation from chatgpt");
    }
    return response.choices[0].message.content;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch company relation from chatgpt");
  }
};
