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
  onDashboard?: boolean;
  createdAt?: Date;
  rootRelation?: string;
  employeeCount?: string;
  revenue?: string;
  wikiData?: WikiData;
  products?: string;
  keyPeople?: string;
  competitors?: string;
  summary?: string;
  numOfLocations?: number;
}

export interface WikiData {
  summary?: string;
  products?: string;
  revenue?: string;
  keyPeople?: string;
  competitors?: string;
  website?: string;
  employeeCount?: string;
}

export interface UserCompanyRequest {
  userId: string;
  name: string;
  industry: string;
  productOrService: string;
  website?: string;
  ceo: string;
}
