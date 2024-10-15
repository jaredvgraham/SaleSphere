import { Schema, model, models, Types } from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  plan: "none" | "basic" | "standard" | "premium";
  companyIds?: Types.ObjectId[];
  customerId?: string;
  subscriptionId?: string;
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
    enum: ["none", "basic", "standard", "premium"],
    default: "none",
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
  subscriptionId: {
    type: String,
    default: null,
  },
});

userSchema.index({ clerkId: 1, email: 1 });

const User = models.User || model<IUser>("User", userSchema);

export default User;
