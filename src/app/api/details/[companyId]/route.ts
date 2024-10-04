import { NextRequest, NextResponse } from "next/server";

import Company from "@/models/companyModel";

import { connectDB } from "@/lib/db";
import { getDetails } from "@/services/chatGPT/getDetails";
import { wikiScraper } from "@/services/scraping/wiki";
import { getWebsite } from "@/services/chatGPT/getWebsite";

type WikiData = {
  name: string;
  summary: string;
  products: string;
  revenue: string;
  keyPeople: string;
  competitors: string;
  rootRelation: string;
  website: string;
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
    const companyDataCheck = company.wikiData
      ? company.wikiData.toObject()
      : null;

    if (companyDataCheck?.summary) {
      const dataToSend = {
        ...companyDataCheck,
        name: company.name,
      };
      console.log("sending data", dataToSend);
      return NextResponse.json({ companyData: dataToSend }, { status: 200 });
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
    const companyData: WikiData = {
      name: company.name,
      summary: "",
      products: "",
      revenue: "",
      keyPeople: "",
      competitors: "",
      rootRelation: "",
      website: "",
    };

    const [corr, website, wikiData] = await Promise.all([
      getDetails(rootCompany.name, company.name),
      getWebsite(company.name),
      wikiScraper(company.name),
    ]);

    companyData.rootRelation = corr;
    companyData.website = website;

    if (!wikiData) {
      return NextResponse.json(
        { error: "Failed to fetch company data from Wikipedia" },
        { status: 500 }
      );
    }
    console.log("relatio", companyData.rootRelation);

    companyData.summary = wikiData.summary;
    companyData.products = wikiData.products;
    companyData.revenue = wikiData.revenue;
    companyData.keyPeople = wikiData.keyPeople;
    companyData.competitors = wikiData.competitors;

    console.log("sending data", companyData);
    company.wikiData = companyData;
    await company.save();

    return NextResponse.json({ companyData }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}
