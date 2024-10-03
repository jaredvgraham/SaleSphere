import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import { getSimilarCompanies } from "@/services/getSimilarCompanies";
import { addCompanies } from "@/services/mongo/addCompanies";

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
    const [relatedCompanies, nearbyCompanies] = await Promise.all([
      Company.find({ _id: { $in: company.relatedCompanyIds } }),
      Company.find({ _id: { $in: company.nearbyCompanyIds } }),
    ]);

    if (relatedCompanies.length === 0 || nearbyCompanies.length === 0) {
      const companyData = await getSimilarCompanies(company.name);
      if (!companyData) {
        return NextResponse.json(
          { error: "Company info not found" },
          { status: 404 }
        );
      }
      const relatedCompanyIds = await addCompanies(
        companyData.relatedCompanies,
        company._id,
        "related"
      );
      const nearbyCompanyIds = await addCompanies(
        companyData.nearbyCompanies,
        company._id,
        "nearby"
      );

      company.relatedCompanyIds = relatedCompanyIds;
      company.nearbyCompanyIds = nearbyCompanyIds;
      company.website = companyData.website;
      company.industry = companyData.industry;
      await company.save();
    }

    return NextResponse.json(
      { company: company, related: relatedCompanies, nearby: nearbyCompanies },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
