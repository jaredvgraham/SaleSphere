import mongoose, { Schema, model, models, Types } from "mongoose";

export interface WikiData {
  summary?: string;
  products?: string;
  revenue?: string;
  keyPeople?: string;
  competitors?: string;
  rootRelation?: string;
  website?: string;
}

export interface ICompany {
  _id: Types.ObjectId;
  name: string;
  rootCompanyId?: Types.ObjectId;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  industry?: string;
  nearbyCompanyIds?: Types.ObjectId[]; // Reference to other company documents
  website?: string;
  relatedCompanyIds?: Types.ObjectId[]; // Reference to other company documents
  onDashboard: boolean;
  createdAt?: Date;
  wikiData?: WikiData;
  favorite: boolean;
}

const wikiDataSchema = new Schema<WikiData>({
  summary: { type: String },
  products: { type: String },
  revenue: { type: String },
  keyPeople: { type: String },
  competitors: { type: String },
  rootRelation: { type: String },
  website: { type: String },
});

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
    },
  },
  industry: { type: String },
  nearbyCompanyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }], // Store ObjectId references to nearby companies
  website: { type: String },
  relatedCompanyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }], // Store ObjectId references to related companies
  onDashboard: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  wikiData: { type: wikiDataSchema, default: {} },
  favorite: { type: Boolean, default: false },
});

// 2dsphere index for geospatial queries
companySchema.index({ location: "2dsphere", name: 1, rootCompanyId: 1 });

const Company = models.Company || model<ICompany>("Company", companySchema);

export default Company;
