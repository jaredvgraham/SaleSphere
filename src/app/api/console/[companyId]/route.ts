import { connectDB } from "@/lib/db";
import Company from "@/models/companyModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { wikiScraper } from "@/services/scraping/wiki";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;
  if (!companyId) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }
  try {
    const { userId } = auth();
    await connectDB();
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (company.favorite === false) {
      company.favorite = true;
      await company.save();
    }
    if (!company.wikiData) {
      const wikiData = await wikiScraper(company.name);
      company.wikiData = wikiData;
      await company.save();
    }

    return NextResponse.json(
      {
        name: company.name,
        summary: company.wikiData?.summary,
        revenue: company.wikiData?.revenue,
        keyPeople: company.wikiData?.keyPeople,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get company" },
      { status: 500 }
    );
  }
}
