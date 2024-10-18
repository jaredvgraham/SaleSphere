import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import UserCompany from "@/models/userCompanyModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/userModel";
import { addUserCompany } from "@/services/mongo/addUserCompany";

export async function POST(req: NextRequest) {
  const { name, industry, productOrService, website, ceo } = await req.json();
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "auth failed" }, { status: 400 });
  }
  const userCompanyRequest = {
    userId: userId,
    name: name,
    industry: industry,
    productOrService: productOrService,
    website: website,
    ceo: ceo,
  };
  try {
    const resp = await addUserCompany(userCompanyRequest);
    if (resp) {
      return NextResponse.json(
        { message: "user company saved successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "unable to save user company" },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Auth failed" }, { status: 400 });
  }
  try {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: "User not found for clerk id" },
        { status: 404 }
      );
    }

    const userCompany = await UserCompany.findOne({ userId: user._id });
    console.log(userCompany);
    return NextResponse.json({ userCompany: userCompany }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
