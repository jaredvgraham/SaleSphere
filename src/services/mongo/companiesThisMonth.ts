import Company from "@/models/companyModel";
import { IUser } from "@/models/userModel";

export async function getCompaniesThisMonth(user: IUser) {
  try {
    // Calculate the date one month ago from today
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Query companies created in the last month
    const companies = await Company.find({
      _id: { $in: user.companyIds },
      createdAt: { $gte: oneMonthAgo },
    });

    // Return the companies and their count
    return {
      monthCompanies: companies,
      totalCount: companies.length,
    };
  } catch (error) {
    console.error("Error fetching companies created in the last month:", error);
    throw error;
  }
}
