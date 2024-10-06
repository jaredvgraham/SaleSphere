import Company, { ICompany } from "@/models/companyModel";

export async function fetchRelatedAndNearbyCompanies(company: ICompany) {
  const [relatedCompanies, nearbyCompanies] = await Promise.all([
    Company.find({ _id: { $in: company.relatedCompanyIds } }),
    Company.find({ _id: { $in: company.nearbyCompanyIds } }),
  ]);
  return { relatedCompanies, nearbyCompanies };
}
