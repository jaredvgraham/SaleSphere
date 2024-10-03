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
    const userCompanies = await Company.find({ _id: { $in: user.companyIds } });
    if (userCompanies.length > 0) {
      if (userCompanies.some((company) => company.name === companyName)) {
        return NextResponse.json(
          { error: "Company already exists" },
          { status: 400 }
        );
      }
    }
    const mainCompany = new Company({
      name: companyName,
      website: companyData.website,
    });
    await mainCompany.save();

    const companyCheck = await Company.findOne({ _id: mainCompany._id });
    if (!companyCheck) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (!companyCheck.rootCompanyId) {
      companyCheck.onDashboard = true;
      await companyCheck.save();
    }

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

    mainCompany.relatedCompanyIds = relatedCompanyIds;
    mainCompany.nearbyCompanyIds = nearbyCompanyIds;

    user.companyIds.push(...relatedCompanyIds, ...nearbyCompanyIds);

    await mainCompany.save();
    await user.save();

    // Placeholder for fetching/scraping company data for similarities to other companies
    return NextResponse.json({ mainCompany }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = auth();
    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const companies = await Company.find({
      _id: { $in: user.companyIds },
      onDashboard: true,
    });
    for (let i = 0; i < companies.length; i++) {
      console.log("company on dqah", companies[i].onDashboard);
    }
    if (!companies) {
      return NextResponse.json(
        { error: "Companies not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error });
  }
}
