import { openai } from "@/lib/chatGPT";
import { googleURL } from "@/lib/googleURL";
import { googleSearch } from "../google/googleSearch";
type SizeAndRev = {
  employeeCount: string;
  revenue: string;
};

export const getSizeAndRev = async (company: string) => {
  const URL = googleURL(`${company} number of employees`);
  const URL2 = googleURL(`${company} yearly revenue`);

  const googleEmployeeCount = await googleSearch(URL);
  const googleRevenue = await googleSearch(URL2);

  const prompt = `Here is the google search result for the number of employees of ${company}: ${googleEmployeeCount},
    Here is the google search result for the yearly revenue of ${company}: ${googleRevenue}.
    From the above information, can you provide the employee count and revenue of ${company} in the following format:
    **Important**: Even if employee count is an exact number, please provide a range. For example, if the employee count is 100, please provide the range as "50-100".
    **Important**: If the revenue is a range or not an exact number, please provide the revenue in an exact number format. For example, if the revenue is "$1.5 billion - $2 billion", please provide the revenue as "$1.7 billion".
    **Important**: Only return the result in **valid JSON format**. No explanations or additional text should be provided. Use this example format:
   data = {
      "employeeCount": "500-1000",
      "revenue": "$1.5 billion
    }
    `;
  console.log("prompt", prompt);

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
