import { openai } from "@/lib/chatGPT";

export const getMoreCompanies = async (
  company: string,
  pastCompanies: string[]
) => {
  const prompt = `You will do detailed research about the company ${company}. Then you will provide the following information:
- A list of 100 related or similar companies **Important**: that are not in the following list: ${pastCompanies.join(
    ", "
  )}.

Please list the related companies by name.

**Important**: Only return the result in **valid JSON format**. No explanations or additional text should be provided. Use this format:
{
  "relatedCompanies": [
    "Innovative Systems",
    "SmartTech Services",
    "Digital Pioneers"
  ]
}
`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a sales prospecting agent." },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // console.log(completion.choices[0].message);
    const res = completion.choices[0].message;
    console.log("res", res);
    console.log("token count", completion.usage?.total_tokens);

    if (!res.content) {
      throw new Error("No response from GPT-4o");
    }
    try {
      const jsonString = res.content.replace(/```json|```/g, "").trim();
      const companyData = JSON.parse(jsonString); // Ensure JSON format is correct
      console.log("companyData", companyData);

      return companyData;
    } catch (error) {
      console.error("Error parsing JSON: ", error);
      throw new Error("Failed to parse company data");
    }
  } catch (error) {
    console.error(error);
  }
};
