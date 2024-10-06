import { openai } from "@/lib/chatGPT";
type SizeAndRev = {
  employeeCount: string;
  revenue: string;
};

export const getSizeAndRev = async (company: string) => {
  const prompt = `Research the company ${company} and find the employee count and yaerly revenue.
    **Important**: Only return the result in **valid JSON format**. No explanations or additional text should be provided. Use this example format:
   data = {
      "employeeCount": "500-1000",
      "revenue": "$1.5 billion
    }
    `;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert on researching companies.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    if (!completion.choices[0].message.content) {
      throw new Error("Failed to fetch company relation from chatgpt");
    }
    const res = completion.choices[0].message;
    console.log("res", res);
    console.log("token count", completion.usage?.total_tokens);

    if (!res.content) {
      throw new Error("No response from GPT-4o");
    }
    const jsonString = res.content.replace(/```json|```/g, "").trim();

    // Parse the JSON string into an object
    const companyData = JSON.parse(jsonString);
    return companyData as SizeAndRev;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch company relation from chatgpt");
  }
};
