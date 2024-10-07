import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import Company, { ICompany } from "@/models/companyModel";
import { getSimilarCompanies } from "@/services/chatGPT/getSimilarCompanies";
import { addCompanies } from "@/services/mongo/addCompanies";
import mongoose, { ObjectId } from "mongoose";
import { getSizeAndRev } from "@/services/chatGPT/getSizeAndRev";
import { fetchRelatedAndNearbyCompanies } from "@/services/mongo/fetchRelatedAndNearbyCompanies";
import { addSizeAndRev } from "@/services/mongo/addSizeAndRev";

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  console.log("GET REQUEST HIT");
  try {
    const { companyId } = params;
    const { userId } = auth();
    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const { relatedCompanies, nearbyCompanies } =
      await fetchRelatedAndNearbyCompanies(company);

    if (relatedCompanies.length > 0 && nearbyCompanies.length > 0) {
      for (let i = 0; i < relatedCompanies.length; i++) {
        let relatedScoree = await relatedScore(
          company.employeeCount as string,
          company.revenue as string,
          relatedCompanies[i].employeeCount as string,
          relatedCompanies[i].revenue as string
        );
        console.log(relatedScoree);
        relatedCompanies[i].relatedScore = relatedScoree;
      }
      const relatedCompaniesResponse = mergeSort(relatedCompanies);
      console.log(relatedCompaniesResponse[0]);
      return NextResponse.json(
        { company, related: relatedCompaniesResponse, nearby: nearbyCompanies },
        { status: 200 }
      );
    }

    const companyData = await getSimilarCompanies(company.name);
    if (!companyData) {
      return NextResponse.json(
        { error: "Company info not found" },
        { status: 404 }
      );
    }

    const userCompanyNames = await Promise.all(
      user.companyIds.map(async (id: ObjectId) => {
        const existingCompany = await Company.findById(id);
        return existingCompany?.name;
      })
    );

    const existingCompanyNames = [
      ...relatedCompanies.map((c) => c.name),
      ...nearbyCompanies.map((c) => c.name),
      ...userCompanyNames,
    ];

    const filteredRelatedCompanies = companyData.relatedCompanies.filter(
      (relatedCompany: any) => !existingCompanyNames.includes(relatedCompany)
    );

    const filteredNearbyCompanies = companyData.nearbyCompanies.filter(
      (nearbyCompany: any) => !existingCompanyNames.includes(nearbyCompany)
    );

    const [relatedCompanyIds, nearbyCompanyIds] = await Promise.all([
      addCompanies(filteredRelatedCompanies, company._id, "related"),
      addCompanies(filteredNearbyCompanies, company._id, "nearby"),
    ]);

    if (!company.rootCompanyId) {
      console.log("Root company not found for", company.name);
      await Promise.all(
        [...relatedCompanyIds, ...nearbyCompanyIds].map(
          (id: mongoose.Types.ObjectId) => addSizeAndRev(id)
        )
      );
    }

    user.companyIds.push(...relatedCompanyIds, ...nearbyCompanyIds);
    company.relatedCompanyIds.push(...relatedCompanyIds);
    company.nearbyCompanyIds.push(...nearbyCompanyIds);
    company.website = companyData.website;
    company.industry = companyData.industry;

    await Promise.all([user.save(), company.save()]);

    const [fullRelatedCompanies, fullNearbyCompanies] = await Promise.all([
      Company.find({ name: { $in: filteredRelatedCompanies } }),
      Company.find({ name: { $in: filteredNearbyCompanies } }),
    ]);

    console.log("Full related and nearby companies fetched");

    console.log("Calculating related scores for related companies...");

    for (let i = 0; i < fullRelatedCompanies.length; i++) {
      const score = await relatedScore(
        company.employeeCount as string,
        company.revenue as string,
        fullRelatedCompanies[i].employeeCount as string,
        fullRelatedCompanies[i].revenue as string
      );

      // Log the input parameters and the calculated score
      console.log(`Calculating score for: 
          Company: ${fullRelatedCompanies[i].name}, 
          Root Employee Count: ${company.employeeCount}, 
          Root Revenue: ${company.revenue}, 
          Related Employee Count: ${fullRelatedCompanies[i].employeeCount}, 
          Related Revenue: ${fullRelatedCompanies[i].revenue}
          Score: ${score}`);
      fullRelatedCompanies[i].relatedScore = score;
    }
    const relatedCompaniesResponse = mergeSort(fullRelatedCompanies);
    console.log(relatedCompaniesResponse[0]);
    console.log("GET FUNC DONE");
    return NextResponse.json(
      {
        company,
        related: relatedCompaniesResponse,
        nearby: fullNearbyCompanies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const relatedScore = async function (
  rootEmployeeCount: string,
  rootRevenue: string,
  relatedEmployeeCount: string,
  relatedRevenue: string
) {
  console.log("Calculating score for:", {
    rootEmployeeCount,
    rootRevenue,
    relatedEmployeeCount,
    relatedRevenue,
  });
  if (relatedEmployeeCount == null || relatedRevenue == null) {
    return 100000000000000;
  }
  const parseRevenue = (revenue: string): number => {
    const cleanedRevenue = revenue.replace(/[$,]/g, "").toLowerCase(); // Remove $ and , and lowercase
    let baseRevenue = parseFloat(cleanedRevenue); // Parse number part

    if (cleanedRevenue.includes("million")) {
      baseRevenue *= 1_000_000;
    } else if (cleanedRevenue.includes("billion")) {
      baseRevenue *= 1_000_000_000;
    }
    return baseRevenue;
  };

  const parseEmployeeCount = (count: string): number => {
    const [min, max] = count.split("-").map((num) => parseInt(num.trim()));
    return max ? Math.floor((min + max) / 2) : min;
  };

  const rootEmployee = parseEmployeeCount(rootEmployeeCount);
  const relatedEmployee = parseEmployeeCount(relatedEmployeeCount);
  const rootRev = parseRevenue(rootRevenue);
  const relatedRev = parseRevenue(relatedRevenue);

  const employeeDiff = Math.abs(rootEmployee - relatedEmployee);
  const revDiff = Math.abs(rootRev - relatedRev);

  const relatedScore = Math.sqrt(employeeDiff ** 2 + revDiff ** 2);
  return relatedScore;
};

const mergeSort = (relatedCompanies: ICompany[]): ICompany[] => {
  // Base case: arrays with fewer than 2 elements are already sorted
  if (relatedCompanies.length < 2) {
    return relatedCompanies;
  }

  // Split the array into halves
  const mid = Math.floor(relatedCompanies.length / 2);
  const left = mergeSort(relatedCompanies.slice(0, mid));
  const right = mergeSort(relatedCompanies.slice(mid));

  // Merge the sorted halves
  return merge(left, right);
};

// Helper function to merge two sorted arrays
const merge = (left: ICompany[], right: ICompany[]): ICompany[] => {
  const sortedArray: ICompany[] = [];
  let i = 0; // Pointer for left array
  let j = 0; // Pointer for right array

  // Compare elements from left and right and push the smaller one to sortedArray
  while (i < left.length && j < right.length) {
    if ((left[i].relatedScore as number) < (right[j].relatedScore as number)) {
      sortedArray.push(left[i]);
      i++;
    } else {
      sortedArray.push(right[j]);
      j++;
    }
  }

  // Concatenate any remaining elements from left or right
  return sortedArray.concat(left.slice(i)).concat(right.slice(j));
};
