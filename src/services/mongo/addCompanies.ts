import Company from "@/models/companyModel";
import { Types } from "mongoose";

export const addCompanies = async (
  companyNames: string[],
  rootCompanyId: Types.ObjectId,
  type: "related" | "nearby"
): Promise<Types.ObjectId[]> => {
  try {
    const savedCompanies = await Promise.all(
      companyNames.map(async (name) => {
        const newCompany = new Company({
          name,
          rootCompanyId,
        });
        await newCompany.save();
        return newCompany._id;
      })
    );

    return savedCompanies;
  } catch (error) {
    console.error(`Error adding ${type} companies:`, error);
    throw new Error(`Failed to add ${type} companies`);
  }
};
