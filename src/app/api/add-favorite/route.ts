import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Company from "@/models/companyModel";

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();
    await connectDB();
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    company.favorite = true;
    company.markModified("favorite");
    await company.save();
    return NextResponse.json({ message: "Favorite added" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { companyId } = await req.json();

  try {
    await connectDB();
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    company.favorite = false;
    await company.save();
    return NextResponse.json({ message: "Favorite removed" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
