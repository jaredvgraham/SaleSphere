import mongoose, { Schema, model, models, Types } from "mongoose";

export interface ICompany {
  name: string;
  rootCompanyId?: Types.ObjectId;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  industry?: string;
  nearbyCompanies?: Types.ObjectId[]; // Reference to other company documents
  website?: string;
  relatedCompanies?: Types.ObjectId[]; // Reference to other company documents
}

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  rootCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // Store ObjectId reference to root company
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  industry: { type: String },
  nearbyCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }], // Store ObjectId references to nearby companies
  website: { type: String },
  relatedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }], // Store ObjectId references to related companies
});

// 2dsphere index for geospatial queries
companySchema.index({ location: "2dsphere", name: 1, rootCompanyId: 1 });

const Company = models.Company || model<ICompany>("Company", companySchema);

export default Company;
