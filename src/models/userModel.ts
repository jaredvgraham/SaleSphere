import { Schema, model, models, Types } from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  plan: "basic" | "standard" | "premium";
  companyIds?: Types.ObjectId[];
  customerId?: string;
}
//
const userSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
  },
  plan: {
    type: String,
    enum: ["basic", "standard", "premium"],
    default: "basic",
  },
  companyIds: [
    {
      type: Types.ObjectId,
      ref: "Company",
    },
  ],
  customerId: {
    type: String,
    default: null,
  },
});

userSchema.index({ clerkId: 1, email: 1 });

const User = models.User || model<IUser>("User", userSchema);

export default User;
