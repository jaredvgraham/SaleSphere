import { connectDB } from "@/lib/db";
import Company from "@/models/companyModel";
import User from "@/models/userModel";
import { getSimilarCompanies } from "@/services/chatGPT/getSimilarCompanies";
import { getSizeAndRev } from "@/services/chatGPT/getSizeAndRev";
import { addCompanies } from "@/services/mongo/addCompanies";
import { addSizeAndRev } from "@/services/mongo/addSizeAndRev";
import { getCompaniesThisMonth } from "@/services/mongo/companiesThisMonth";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
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
        { message: "Company name is required" },
        { status: 400 }
      );
    }
    const userCompanies = await Company.find({ _id: { $in: user.companyIds } });
    if (userCompanies.length > 0) {
      if (
        userCompanies.some(
          (company) => company.name === companyName && !company.rootCompanyId
        )
      ) {
        return NextResponse.json(
          { message: "Company already exists" },
          { status: 400 }
        );
      }
    }
    const [companyData, revAndSize] = await Promise.all([
      getSimilarCompanies(companyName),
      getSizeAndRev(companyName),
    ]);

    if (!companyData) {
      return NextResponse.json(
        { message: "Company info not found" },
        { status: 404 }
      );
    }

    const mainCompany = new Company({
      name: companyName,
      website: companyData.website,
      industry: companyData.industry,
      employeeCount: revAndSize.employeeCount,
      revenue: revAndSize.revenue,
    });
    await mainCompany.save();

    const companyCheck = await Company.findOne({ _id: mainCompany._id });
    if (!companyCheck) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
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
    console.log("addSizeAndRev");

    await Promise.all(
      [...relatedCompanyIds, ...nearbyCompanyIds].map(
        (id: mongoose.Types.ObjectId) => addSizeAndRev(id)
      )
    );

    mainCompany.relatedCompanyIds = relatedCompanyIds;
    mainCompany.nearbyCompanyIds = nearbyCompanyIds;

    user.companyIds.push(...relatedCompanyIds, ...nearbyCompanyIds);

    await mainCompany.save();
    await user.save();

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
      $or: [{ onDashboard: true }, { favorite: true }],
    });

    if (!companies) {
      return NextResponse.json(
        { error: "Companies not found" },
        { status: 404 }
      );
    }
    const { monthCompanies } = await getCompaniesThisMonth(user);

    console.log("monthCompanies", monthCompanies.length);

    return NextResponse.json(
      { companies, totalCompanies: user.companyIds.length, monthCompanies },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error });
  }
}
