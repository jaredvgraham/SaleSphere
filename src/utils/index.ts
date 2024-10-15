import { Company } from "@/types";
import { format } from "date-fns";

export const groupCompaniesByDate = (companies: Company[], type = "day") => {
  const groupedCompanies: { [key: string]: number } = {}; // Explicitly define the object

  companies.forEach((company) => {
    const createdAt = new Date(company.createdAt as Date);
    let dateKey: string | undefined;

    if (type === "day") {
      // Group by day
      dateKey = format(createdAt, "yyyy-MM-dd");
    } else if (type === "week") {
      // Group by week (returns the first day of the week)
      dateKey = format(createdAt, "yyyy-'W'ww");
    }

    // Ensure that dateKey is defined before using it as an index
    if (dateKey) {
      if (!groupedCompanies[dateKey]) {
        groupedCompanies[dateKey] = 1;
      } else {
        groupedCompanies[dateKey]++;
      }
    }
  });

  // Convert groupedCompanies object to array format for charting
  return Object.keys(groupedCompanies).map((date) => ({
    date,
    count: groupedCompanies[date],
  }));
};
