import { openai } from "@/lib/chatGPT";

export const getSimilarCompanies = async (company: string) => {
  const prompt = `Provide detailed information about the company ${company}. I would like to know:
1. The industry this company operates in. Choose from the following list of industries:
   - Technology
   - Healthcare
   - Finance
   - Energy
   - Manufacturing
   - Retail
   - Telecommunications
   - Automotive
   - Agriculture
   - Hospitality and Tourism
2. A list of find where ${company} is located and give me 10 companies within a 5 mile radius of their address 
3. ${company}'s official website.
4. A list of 100 related or similar companies.

Please list the nearby and related companies by name.

**Important**: Only return the result in **valid JSON format**. No explanations or additional text should be provided. Use this format:
{
  "name": "Tech Innovators Ltd",
  "industry": "Technology",
  "website": "https://www.techinnovators.com",
  "nearbyCompanies": [
    "NextGen Solutions",
    "FutureTech Enterprises",
    "Quantum Systems"
  ],
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
        { role: "system", content: "You are a helpful assistant." },
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
    const jsonString = res.content.replace(/```json|```/g, "").trim();

    // Parse the JSON string into an object
    const companyData = JSON.parse(jsonString);
    return companyData;
  } catch (error) {
    console.error(error);
  }
};
