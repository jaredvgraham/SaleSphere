import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import { getSimilarCompanies } from "@/services/chatGPT/getSimilarCompanies";
import { addCompanies } from "@/services/mongo/addCompanies";
import { getSizeAndRev } from "@/services/chatGPT/getSizeAndRev";
import { getMoreCompanies } from "@/services/chatGPT/getMoreSimilar";
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

    if (!company.employeeCount || !company.revenue) {
      const sizeAndRev = await getSizeAndRev(company.name);
      if (sizeAndRev) {
        company.employeeCount = sizeAndRev.employeeCount;
        company.revenue = sizeAndRev.revenue;
        await company.save();
      }
    }

    const [relatedCompanies, nearbyCompanies] = await Promise.all([
      Company.find({ _id: { $in: company.relatedCompanyIds } }),
      Company.find({ _id: { $in: company.nearbyCompanyIds } }),
    ]);

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

    const companyData = await getMoreCompanies(
      company.name,
      existingCompanyNames
    );
    if (!companyData) {
      return NextResponse.json(
        { error: "Company info not found" },
        { status: 404 }
      );
    }

    const filteredRelatedCompanies = [];

    for (const relatedCompany of companyData.relatedCompanies) {
      if (!existingCompanyNames.includes(relatedCompany)) {
        filteredRelatedCompanies.push(relatedCompany);
      } else {
        console.log("company already exists", relatedCompany);
      }
    }

    const relatedCompanyIds = await Promise.all(
      filteredRelatedCompanies.map(async (relatedCompanyName) => {
        const newCompanyId = await addCompanies(
          [relatedCompanyName],
          company._id,
          "related"
        );

        const newCompany = await Company.findById(newCompanyId[0]);
        if (newCompany) {
          const sizeAndRev = await getSizeAndRev(relatedCompanyName);
          if (sizeAndRev) {
            newCompany.employeeCount = sizeAndRev.employeeCount;
            newCompany.revenue = sizeAndRev.revenue;
            await newCompany.save();
          }
        }
        return newCompanyId[0];
      })
    );

    user.companyIds.push(...relatedCompanyIds);
    await user.save();

    company.relatedCompanyIds.push(...relatedCompanyIds);
    await company.save();

    const fullRelatedCompanies = await Company.find({
      _id: { $in: relatedCompanyIds },
    });

    return NextResponse.json(
      {
        company: company,
        related: fullRelatedCompanies,
        nearby: nearbyCompanies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
