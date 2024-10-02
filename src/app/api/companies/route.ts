import Company from "@/models/companyModel";
import { getSimilarCompanies } from "@/services/getSimilarCompanies";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

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

    const relatedCompanies = await Promise.all(
      companyData.relatedCompanies.map(async (company: string) => {
        const newCompany = new Company({
          name: company,
          rootCompanyId: mainCompany._id,
        });
        await newCompany.save();
        return newCompany;
      })
    );

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
