import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import { getSizeAndRev } from "@/services/chatGPT/getSizeAndRev";
import { ObjectId } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;
    const { userId } = auth();
    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const sizeAndRev = await getSizeAndRev(company.name);
    if (!sizeAndRev) {
      return NextResponse.json(
        { error: "Company info not found" },
        { status: 404 }
      );
    }

    console.log("sizeAndRev", sizeAndRev);
    console.log(typeof sizeAndRev);

    console.log("employeeCount", sizeAndRev.employeeCount);
    console.log("revenue", sizeAndRev.revenue);

    company.employeeCount = sizeAndRev.employeeCount;
    company.revenue = sizeAndRev.revenue;

    await company.save();

    return NextResponse.json(sizeAndRev, { status: 200 });
  } catch (error) {
    console.error("Error getting company size and revenue:", error);
    return NextResponse.json(
      { error: "Failed to get company size and revenue" },
      { status: 500 }
    );
  }
}
