export interface OnboardingData {
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
