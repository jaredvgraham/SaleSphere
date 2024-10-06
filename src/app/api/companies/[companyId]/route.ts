import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import { getSimilarCompanies } from "@/services/chatGPT/getSimilarCompanies";
import { addCompanies } from "@/services/mongo/addCompanies";
import { ObjectId } from "mongoose";
import { getSizeAndRev } from "@/services/chatGPT/getSizeAndRev";

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

    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const [relatedCompanies, nearbyCompanies] = await Promise.all([
      Company.find({ _id: { $in: company.relatedCompanyIds } }),
      Company.find({ _id: { $in: company.nearbyCompanyIds } }),
    ]);

    if (relatedCompanies.length > 0 && nearbyCompanies.length > 0) {
      return NextResponse.json(
        { company, related: relatedCompanies, nearby: nearbyCompanies },
        { status: 200 }
      );
    }

    const companyData = await getSimilarCompanies(company.name);
    if (!companyData) {
      return NextResponse.json(
        { error: "Company info not found" },
        { status: 404 }
      );
    }

    const userCompanyNames = await Promise.all(
      user.companyIds.map(async (id: ObjectId) => {
        const existingCompany = await Company.findById(id);
        return existingCompany?.name;
      })
    );

    const existingCompanyNames = [
      ...relatedCompanies.map((c) => c.name),
      ...nearbyCompanies.map((c) => c.name),
      ...userCompanyNames,
    ];

    const filteredRelatedCompanies = companyData.relatedCompanies.filter(
      (relatedCompany: any) => !existingCompanyNames.includes(relatedCompany)
    );

    const filteredNearbyCompanies = companyData.nearbyCompanies.filter(
      (nearbyCompany: any) => !existingCompanyNames.includes(nearbyCompany)
    );

    const [relatedCompanyIds, nearbyCompanyIds] = await Promise.all([
      addCompanies(filteredRelatedCompanies, company._id, "related"),
      addCompanies(filteredNearbyCompanies, company._id, "nearby"),
    ]);

    const updatedCompaniesPromises = [
      ...relatedCompanyIds,
      ...nearbyCompanyIds,
    ].map(async (companyId) => {
      const company = await Company.findById(companyId);
      if (!company) return null;
      const sizeAndRev = await getSizeAndRev(company.name);
      if (sizeAndRev) {
        company.employeeCount = sizeAndRev.employeeCount;
        company.revenue = sizeAndRev.revenue;
        await company.save();
      }
      return company;
    });

    await Promise.all(updatedCompaniesPromises);

    user.companyIds.push(...relatedCompanyIds, ...nearbyCompanyIds);
    company.relatedCompanyIds.push(...relatedCompanyIds);
    company.nearbyCompanyIds.push(...nearbyCompanyIds);
    company.website = companyData.website;
    company.industry = companyData.industry;

    await Promise.all([user.save(), company.save()]);

    const [fullRelatedCompanies, fullNearbyCompanies] = await Promise.all([
      Company.find({ name: { $in: filteredRelatedCompanies } }),
      Company.find({ name: { $in: filteredNearbyCompanies } }),
    ]);

    return NextResponse.json(
      {
        company,
        related: fullRelatedCompanies,
        nearby: fullNearbyCompanies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
