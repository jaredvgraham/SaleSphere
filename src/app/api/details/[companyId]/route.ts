import { NextRequest, NextResponse } from "next/server";

import Company from "@/models/companyModel";

import { connectDB } from "@/lib/db";
import { getDetails } from "@/services/chatGPT/getDetails";
import { wikiScraper } from "@/services/scraping/wiki";

type WikiData = {
  name: string;
  summary: string;
  products: string;
  revenue: string;
  keyPeople: string;
  competitors: string;
  rootRelation: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;
  console.log(companyId);

  try {
    await connectDB();
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    console.log(company.name);
    const rootCompany = await Company.findOne({
      _id: company.rootCompanyId,
    });
    if (!rootCompany) {
      console.log("Root company not found");
      return NextResponse.json(
        { error: "Root company not found" },
        { status: 404 }
      );
    }
    let companyData: WikiData = {
      name: company.name,
      summary: "",
      products: "",
      revenue: "",
      keyPeople: "",
      competitors: "",
      rootRelation: "",
    };

    companyData.rootRelation = await getDetails(rootCompany.name, company.name);

    const wikiData = await wikiScraper(company.name);
    if (!wikiData) {
      return NextResponse.json(
        { error: "Failed to fetch company data from Wikipedia" },
        { status: 500 }
      );
    }
    companyData.summary = wikiData.summary;
    companyData.products = wikiData.products;
    companyData.revenue = wikiData.revenue;
    companyData.keyPeople = wikiData.keyPeople;
    companyData.competitors = wikiData.competitors;
    return NextResponse.json({ companyData }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}
