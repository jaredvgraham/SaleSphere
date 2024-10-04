export interface Company {
  _id: string;
  name: string;
  rootCompanyId?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  industry?: string;
  nearbyCompanyIds?: string[]; // Reference to other company documents
  website?: string;
  relatedCompanyIds?: string[]; // Reference to other company documents
  favorite?: boolean;
}
