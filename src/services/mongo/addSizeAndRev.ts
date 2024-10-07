import Company from "@/models/companyModel";
import mongoose from "mongoose";

import { getSizeAndRev } from "../chatGPT/getSizeAndRev";

export async function addSizeAndRev(companyId: mongoose.Types.ObjectId) {
  const company = await Company.findById(companyId);
  if (!company) return null;

  const sizeAndRev = await getSizeAndRev(company.name);
  console.log("sizeAndRev", sizeAndRev);

  if (sizeAndRev) {
    company.employeeCount = sizeAndRev.employeeCount;
    company.revenue = sizeAndRev.revenue;
    await company.save();
  }
  return company;
}
