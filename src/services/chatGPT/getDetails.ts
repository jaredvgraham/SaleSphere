import { openai } from "@/lib/chatGPT";

export const getDetails = async (rootCompanyName: string, company: string) => {
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
          content: `Tell me how ${company} is similar or related to ${rootCompanyName}.`,
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
