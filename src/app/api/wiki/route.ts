import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  console.log("Endpoint hit");
  const { companyName } = await req.json();

  if (!companyName) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 }
    );
  }

  try {
    const formattedCompanyName = encodeURIComponent(companyName);
    const wikiUrl = `https://en.wikipedia.org/wiki/${formattedCompanyName}`;

    // Fetch the Wikipedia page
    const { data } = await axios.get(wikiUrl);

    // Load the HTML into a cheerio instance
    const $ = cheerio.load(data);

    // Variables to store summary and paragraph count
    let summary = "";
    let paragraphCount = 0;
    //
    // Loop through paragraphs to find a valid one and construct a longer summary
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

        // Stop once we have a few paragraphs (adjust number if needed)
        if (paragraphCount >= 3) {
          return false; // Break out of loop once we have enough content
        }
      }
    });

    if (summary) {
      return NextResponse.json({ summary: summary.trim() }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Summary not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch company summary", details: error.message },
      { status: 500 }
    );
  }
}
