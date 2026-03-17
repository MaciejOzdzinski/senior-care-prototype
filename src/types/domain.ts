export type RoleMode = "family" | "caregiver";
export type DiscoveryMode = "cards" | "map";

export interface CapabilityTag {
  id: string;
  label: string;
}

export interface Review {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  date: string;
  text: string;
}

export interface CaregiverProfile {
  id: string;
  name: string;
  age: number;
  rating: number;
  reviews: number;
  distanceKm: number;
  hourlyRate: number;
  availableLabel: string;
  yearsExperience: number;
  compatibility: number;
  avatarGradient: string;
  avatarUrl: string;
  specializations: CapabilityTag[];
  whyMatch: string[];
  lat: number;
  lng: number;
  verified: boolean;
  reviewList: Review[];
}

export interface CareNeed {
  id: string;
  title: string;
  district: string;
  hours: string;
  budget: string;
  needs: CapabilityTag[];
  lat: number;
  lng: number;
}
