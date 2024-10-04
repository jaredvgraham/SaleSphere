import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import { getSimilarCompanies } from "@/services/getSimilarCompanies";
import { addCompanies } from "@/services/mongo/addCompanies";
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

    console.log("user company length BEFORE", user.companyIds.length);
    console.log("user company length BEFORE", user.companyIds.length);
    console.log("user company length BEFORE", user.companyIds.length);
    console.log("user company length BEFORE", user.companyIds.length);

    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const [relatedCompanies, nearbyCompanies] = await Promise.all([
      Company.find({ _id: { $in: company.relatedCompanyIds } }),
      Company.find({ _id: { $in: company.nearbyCompanyIds } }),
    ]);

    const companyData = await getSimilarCompanies(company.name);
    if (!companyData) {
      return NextResponse.json(
        { error: "Company info not found" },
        { status: 404 }
      );
    }

    const filteredRelatedCompanies = [];
    const filteredNearbyCompanies = [];

    const userCompanyNames = await Promise.all(
      user.companyIds.map(async (id: ObjectId) => {
        const existingCompany = await Company.findById({ _id: id });
        return existingCompany?.name;
      })
    );

    const existingCompanyNames = [
      ...relatedCompanies.map((c) => c.name),
      ...nearbyCompanies.map((c) => c.name),
      ...userCompanyNames,
    ];

    for (const relatedCompany of companyData.relatedCompanies) {
      if (!existingCompanyNames.includes(relatedCompany)) {
        filteredRelatedCompanies.push(relatedCompany);
      }
    }

    for (const nearbyCompany of companyData.nearbyCompanies) {
      if (!existingCompanyNames.includes(nearbyCompany)) {
        filteredNearbyCompanies.push(nearbyCompany);
      }
    }

    const relatedCompanyIds = await addCompanies(
      filteredRelatedCompanies,
      company._id,
      "related"
    );
    const nearbyCompanyIds = await addCompanies(
      filteredNearbyCompanies,
      company._id,
      "nearby"
    );

    user.companyIds.push(...relatedCompanyIds, ...nearbyCompanyIds);
    await user.save();

    console.log("user company length AFTER", user.companyIds.length);

    company.relatedCompanyIds = relatedCompanyIds;
    company.nearbyCompanyIds = nearbyCompanyIds;
    company.website = companyData.website;
    company.industry = companyData.industry;
    await company.save();

    const fullRelatedCompanies = await Company.find({
      name: { $in: filteredRelatedCompanies },
    });

    const fullNearbyCompanies = await Company.find({
      name: { $in: filteredNearbyCompanies },
    });

    return NextResponse.json(
      {
        company: company,
        related: fullRelatedCompanies,
        nearby: fullNearbyCompanies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
