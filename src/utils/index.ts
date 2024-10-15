import { Company } from "@/types";

const getManualWeekNumber = (date: Date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInMs = date.getTime() - startOfYear.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const week = Math.ceil((diffInDays + 1) / 7);
  return { year: date.getFullYear(), week };
};

export const groupCompaniesByWeek = (companies: Company[]) => {
  const groupedCompanies: { [key: string]: number } = {};

  // Sort companies by creation date in ascending order (oldest first)
  companies.sort(
    (a, b) =>
      new Date(a.createdAt as Date).getTime() -
      new Date(b.createdAt as Date).getTime()
  );

  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setDate(pastDate.getDate() - 28); // Look at the last 4 weeks

  // Filter companies to only include those created in the last 28 days
  const filteredCompanies = companies.filter((company) => {
    const createdAt = new Date(company.createdAt as Date);
    return createdAt >= pastDate && createdAt <= currentDate;
  });

  // Group the companies by week
  filteredCompanies.forEach((company) => {
    const createdAt = new Date(company.createdAt as Date);
    const { year, week } = getManualWeekNumber(createdAt);
    const weekKey = `${year}-W${week}`;

    if (!groupedCompanies[weekKey]) {
      groupedCompanies[weekKey] = 1;
    } else {
      groupedCompanies[weekKey]++;
    }
  });

  // Prepare the last 4 weeks data for charting, assigning the oldest to "Week-1"
  const weekLabels = ["Week-1", "Week-2", "Week-3", "Week-4"];
  const last4Weeks = [];
  const startWeek = Object.keys(groupedCompanies).sort(); // Ensure it's in order of oldest week first

  for (let i = 0; i < 4; i++) {
    const weekKey = startWeek[i] || "N/A";
    last4Weeks.push({
      date: weekLabels[i],
      count: groupedCompanies[weekKey] || 0,
    });
  }

  return last4Weeks;
};
