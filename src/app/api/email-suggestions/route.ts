import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import UserCompany from "@/models/userCompanyModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { emailText, companyId } = await req.json();
  console.log(companyId);
  const { userId } = auth();
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return NextResponse.json(
      { error: "unable to find user with clerkId" },
      { status: 404 }
    );
  }

  const companySellingTo = await Company.findOne({ _id: companyId });
  if (!companySellingTo) {
    return NextResponse.json(
      { error: "Unable to find company with company ID" },
      { status: 404 }
    );
  }

  const userCompany = await UserCompany.findOne({ userId: user._id });
  if (!userCompany) {
    return NextResponse.json(
      { error: "unale to find user company" },
      { status: 404 }
    );
  }

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
          content: `Provide feedback on this sales email, keep your response short and concise and purely informational\nThis email is going to the company ${companySellingTo.name}, the company I am selling for is ${userCompany.name}, I am selling ${userCompany.productOrService}, we are in the ${userCompany.industry} industry, our website is ${userCompany.website}, and our CEO is ${userCompany.ceo} :\n\n${emailText}`,
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
