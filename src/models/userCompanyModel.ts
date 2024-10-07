import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IUserCompany {
  userId: Types.ObjectId;
  name: string;
  industry: string;
  productOrService: string;
  website?: string;
  ceo: string;
}

const userCompanySchema = new Schema<IUserCompany>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  industry: { type: String, required: true },
  productOrService: { type: String, required: true },
  website: { type: String, required: false },
  ceo: { type: String, required: true },
});

const UserCompany =
  models.UserCompany || model<IUserCompany>("UserCompany", userCompanySchema);

export default UserCompany;
