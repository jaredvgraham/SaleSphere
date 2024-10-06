import { connectDB } from "@/lib/db";
import Company from "@/models/companyModel";

export async function removeFavorite(companyId: string) {
  try {
    await connectDB();
    if (companyId === "") {
      return false;
    }
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return false;
    }
    company.favorite = false;
    await company.save();
    return true;
  } catch (error: any) {
    return false;
  }
}
