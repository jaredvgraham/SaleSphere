import { connectDB } from "@/lib/db";
import { UserCompanyRequest } from "@/types";
import User from "@/models/userModel";
import UserCompany from "@/models/userCompanyModel";
import { error } from "console";

export async function addUserCompany(request: UserCompanyRequest) {
  console.log(request);
  try {
    await connectDB();
    const user = await User.findOne({ clerkId: request.userId });
    if (!user) {
      throw new Error("No user found");
    }
    const userCompany = new UserCompany({
      userId: user._id,
      name: request.name,
      industry: request.industry,
      productOrService: request.productOrService,
      website: request.website,
      ceo: request.ceo,
    });
    await userCompany.save();
    return true;
  } catch (error: any) {
    throw new Error("Unable to save userCompany");
  }
}