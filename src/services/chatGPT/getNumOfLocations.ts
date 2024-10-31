import { openai } from "@/lib/chatGPT";

export const getNumOfLocations = async (company: string) => {
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
          content: `Whats the number of locations for ${company}. **Important**: Only reply with the number of locations no other words are necessary. If the number of locations is not available, please reply with 0.`,
        },
      ],
    });

    // Log the entire response to check what's being returned
    console.log("OpenAI Response:", response);

    if (!response.choices[0].message.content) {
      throw new Error("No response from GPT-4o");
    }

    const content = response.choices[0].message.content.trim();
    console.log("CONTENT", content);

    // Ensure that the content is a number and handle parsing issues
    const numOfLocations = isNaN(Number(content)) ? 0 : Number(content);

    console.log("NUM OF LOC RES", numOfLocations);

    return numOfLocations;
  } catch (error: any) {
    console.log("Error fetching number of locations:", error);
    return 0; // Return 0 as a fallback in case of an error
  }
};
