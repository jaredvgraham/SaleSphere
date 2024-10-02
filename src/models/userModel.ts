import { Schema, model, models } from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  plan: "basic" | "standard" | "premium";
}

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
});

userSchema.index({ clerkId: 1, email: 1 });

const User = models.User || model<IUser>("User", userSchema);

export default User;
