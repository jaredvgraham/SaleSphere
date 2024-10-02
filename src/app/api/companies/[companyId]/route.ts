import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import Company, { ICompany } from "@/models/companyModel";

interface CompanyResponse {
  company: ICompany;
  related: ICompany[];
  nearby: ICompany[];
}

const nearbyCompanies = async (company: ICompany) => {
  return await Company.find({
    _id: { $in: company.nearbyCompanyIds },
  });
};

const relatedCompanies = async (company: ICompany) => {
  return await Company.find({
    _id: { $in: company.relatedCompanyIds },
  });
};

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

    return NextResponse.json(
      { company: company, related: relatedCompanies, nearby: nearbyCompanies },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
