export interface User {
  name: string;
  id: string;
  walletAddress: string;
  imageUrl: string;
  description?: string;
}

export interface Attributes {
  trait_type: string;
  value: string;
}

export interface SBT {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: Attributes[];
  totalSupply: number;
  allowList: string[];
  communityId: string;
  createdAt: Date;
  updatedAt: Date;
  generatorName: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  admins: { [key: string]: "owner" | "admin" };
  imageUrl: string;
  websiteUrl: string;
  emailAddress: string;
  isAuthorized: boolean;
  subscriptionId: string;
  subscriptionStatus: "Free" | "Premium";
  sbts: SBT[];
  createdAt: Date;
  updatedAt: Date;
}
