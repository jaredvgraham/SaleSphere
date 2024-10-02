import { openai } from "@/lib/chatGPT";

export const getSimilarCompanies = async (company: string) => {
  const prompt = `Find companies similar to ${company}.`;

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

  console.log(completion.choices[0].message);
  return completion.choices[0].message;
};
