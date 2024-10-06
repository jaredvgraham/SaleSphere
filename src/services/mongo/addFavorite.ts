import { connectDB } from "@/lib/db";
import Company from "@/models/companyModel";
import { TbBrandGoogleMaps } from "react-icons/tb";

export async function addFavorite(companyId: string) {
  try {
    await connectDB();
    if (!companyId) {
      return false;
    }
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return false;
    }
    company.favorite = true;
    await company.save();
    return true;
  } catch (error: any) {
    return false;
  }
}
