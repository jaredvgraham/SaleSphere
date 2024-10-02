import { connectDB } from "@/lib/db";
import Company from "@/models/companyModel";
import User from "@/models/userModel";
import { getSimilarCompanies } from "@/services/getSimilarCompanies";
import { addCompanies } from "@/services/mongo/addCompanies";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { company: companyName } = await req.json();
    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    let companyData = await getSimilarCompanies(companyName);
    console.log("companyData", companyData);
    console.log("length", companyData.relatedCompanies.length);

    if (!companyData) {
      companyData = await getSimilarCompanies(companyName);
    }

    if (!companyData) {
      return NextResponse.json(
        { error: "Company info not found" },
        { status: 404 }
      );
    }

    const mainCompany = new Company({
      name: companyName,
    });
    await mainCompany.save();

    user.companyIds.push(mainCompany._id);

    const relatedCompanyIds = await addCompanies(
      companyData.relatedCompanies,
      mainCompany._id,
      "related"
    );

    const nearbyCompanyIds = await addCompanies(
      companyData.nearbyCompanies,
      mainCompany._id,
      "nearby"
    );

    mainCompany.relatedCompanies = relatedCompanyIds;
    mainCompany.nearbyCompanies = nearbyCompanyIds;

    user.companyIds.push(...relatedCompanyIds, ...nearbyCompanyIds);

    await mainCompany.save();
    await user.save();

    // Placeholder for fetching/scraping company data for similarities to other companies
    return NextResponse.json({ companyName }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error });
  }
}

// export async function GET(req: NextRequest) {
//   const { userId } = auth();
//   console.log("userId", userId);
//   return NextResponse.json({ userId }, { status: 200 });
// }
