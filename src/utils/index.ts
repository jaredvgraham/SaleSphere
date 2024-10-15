import { Company } from "@/types";

/**
 * Helper function to manually calculate the week number from the date.
 * @param {Date} date - Date object
 * @returns {Object} - { year, week }
 */
const getManualWeekNumber = (date: Date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1); // January 1st of the same year
  const diffInMs = date.getTime() - startOfYear.getTime(); // Difference in milliseconds
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Difference in days
  const week = Math.ceil((diffInDays + 1) / 7); // Calculate the week number
  return { year: date.getFullYear(), week };
};

/**
 * Group companies by manually calculated week for the last 4 weeks.
 * @param {Company[]} companies - Array of companies
 * @returns {Array} - Array of objects with week and count
 */
export const groupCompaniesByWeek = (companies: Company[]) => {
  const groupedCompanies: { [key: string]: number } = {};

  // Get the current date and set up a date 4 weeks ago
  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setDate(pastDate.getDate() - 28); // Rolling 4 weeks (28 days)

  companies.forEach((company) => {
    const createdAt = new Date(company.createdAt as Date);

    // Only consider companies created within the last 4 weeks
    if (createdAt >= pastDate && createdAt <= currentDate) {
      const { year, week } = getManualWeekNumber(createdAt);
      const weekKey = `${year}-W${week}`; // Format year-week as key

      if (!groupedCompanies[weekKey]) {
        groupedCompanies[weekKey] = 1;
      } else {
        groupedCompanies[weekKey]++;
      }
    }
  });

  // Get the current week number and calculate the keys for the last 4 weeks
  const currentWeek = getManualWeekNumber(currentDate).week;
  const currentYear = currentDate.getFullYear();
  const last4Weeks = [];

  for (let i = 0; i < 4; i++) {
    const week = currentWeek - i;
    const weekKey = `${currentYear}-W${week}`;
    last4Weeks.unshift({
      date: weekKey,
      count: groupedCompanies[weekKey] || 0, // Default to 0 if no companies were created that week
    });
  }

  return last4Weeks;
};
