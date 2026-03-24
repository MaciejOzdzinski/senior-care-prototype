export interface OnboardingData {
  authMethod: "apple" | "google" | "phone" | null;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  city: string;
  specializations: string[];
  availableDays: string[];
  availableHoursFrom: string;
  availableHoursTo: string;
  availableFrom: string;
  yearsExperience: string;
  hourlyRate: string;
  bio: string;
}

export const emptyOnboarding: OnboardingData = {
  authMethod: null,
  firstName: "",
  lastName: "",
  avatarUrl: "",
  city: "",
  specializations: [],
  availableDays: [],
  availableHoursFrom: "",
  availableHoursTo: "",
  availableFrom: "",
  yearsExperience: "",
  hourlyRate: "",
  bio: "",
};
