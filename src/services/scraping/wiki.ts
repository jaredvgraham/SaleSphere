import * as cheerio from "cheerio";
import axios from "axios";

export const wikiScraper = async (companyName: string) => {
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
