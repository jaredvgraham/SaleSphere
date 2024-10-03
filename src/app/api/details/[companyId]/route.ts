import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import OpenAI from "openai";
import Company from "@/models/companyModel";
import { connect } from "http2";
import { connectDB } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type WikiData = {
  name: string;
  summary: string;
  products: string;
  revenue: string;
  keyPeople: string;
  competitors: string;
  rootRelation: string;
};

const wikiScraper = async (companyName: string) => {
  const formattedCompanyName = encodeURIComponent(companyName);
  const wikiUrl = `https://en.wikipedia.org/wiki/${formattedCompanyName}`;

  try {
    // Fetch the Wikipedia page
    const { data } = await axios.get(wikiUrl);

    // Load the HTML into a cheerio instance
    const $ = cheerio.load(data);

    let wikiData = {
      name: companyName,
      summary: "",
      products: "",
      revenue: "",
      keyPeople: "",
      competitors: "",
    };

    // Variables to store summary and paragraph count
    let summary = "";
    let paragraphCount = 0;

    // Loop through paragraphs to find valid ones and construct a longer summary
    $("p").each((i, elem) => {
      let paragraph = $(elem).text().trim();

      // Remove citation brackets like [1], [2], etc.
      paragraph = paragraph.replace(/\[\d+\]/g, "");

      // Filter out empty paragraphs or meta information
      if (
        paragraph &&
        !paragraph.toLowerCase().includes("may refer to") &&
        paragraph.length > 50
      ) {
        summary += paragraph + " ";
        paragraphCount++;

        // Stop once we have enough paragraphs (adjust number if needed)
        if (paragraphCount >= 3) {
          return false; // Break out of loop
        }
      }
    });

    wikiData.summary = summary.trim();

    // Extract products/services (often found in a specific section)
    const productsHeader = $("span#Products, span#Services").parent();
    wikiData.products = productsHeader.nextUntil("h2").text().trim();

    // Extract revenue (usually found in the infobox)
    wikiData.revenue = $("th:contains('Revenue')").next("td").text().trim();

    // Extract key people (like CEO or founders from the infobox)
    wikiData.keyPeople = $("th:contains('Key people')")
      .next("td")
      .text()
      .trim();

    // Extract competitors (if mentioned)
    const competitorsHeader = $("span#Competitors").parent();
    wikiData.competitors = competitorsHeader.nextUntil("h2").text().trim();

    return wikiData;
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    return null;
  }
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
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert on companies and what they do.",
          },
          {
            role: "user",
            content: `Tell me how ${company.name} is similar or related to ${rootCompany.name}.`,
          },
        ],
      });
      if (!response.choices[0].message.content) {
        return NextResponse.json(
          { error: "Failed to fetch company relation from chatgpt" },
          { status: 500 }
        );
      }
      companyData.rootRelation = response.choices[0].message.content;
    } catch (error: any) {
      console.log(error);
      return NextResponse.json(
        { error: "Failed to fetch company relation from chatgpt" },
        { status: 500 }
      );
    }
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
