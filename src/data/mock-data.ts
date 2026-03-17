import type { CareNeed, CaregiverProfile } from "@/types/domain";

export const caregivers: CaregiverProfile[] = [
  {
    id: "cg-anna",
    name: "Anna Kowalska",
    age: 47,
    rating: 4.9,
    reviews: 82,
    distanceKm: 1.8,
    hourlyRate: 35,
    availableLabel: "Dostępna jutro 08:00–16:00",
    yearsExperience: 5,
    compatibility: 94,
    avatarGradient: "from-cyan-200/80 via-white/70 to-blue-300/60",
    specializations: [
      { id: "companion", label: "Towarzyszenie" },
      { id: "shopping", label: "Zakupy" },
      { id: "dementia", label: "Demencja" },
    ],
    whyMatch: [
      "Blisko seniora, tylko 1.8 km od wskazanej strefy.",
      "Ma doświadczenie w opiece dziennej i demencji.",
      "Godziny pracy pokrywają się z Twoją potrzebą.",
    ],
    lat: 52.205,
    lng: 21.015,
    verified: true,
  },
  {
    id: "cg-marek",
    name: "Marek Zieliński",
    age: 38,
    rating: 4.8,
    reviews: 41,
    distanceKm: 2.3,
    hourlyRate: 33,
    availableLabel: "Dostępny dziś po 18:00",
    yearsExperience: 4,
    compatibility: 89,
    avatarGradient: "from-sky-200/80 via-white/70 to-indigo-300/60",
    specializations: [
      { id: "mobility", label: "Mobilność" },
      { id: "rehab", label: "Po hospitalizacji" },
      { id: "night", label: "Wieczory" },
    ],
    whyMatch: [
      "Zna opiekę po hospitalizacji i wsparcie przy pionizacji.",
      "Pasuje do budżetu i obsługuje dojazd do 5 km.",
      "Szybko odpowiada — średnio w 12 minut.",
    ],
    lat: 52.212,
    lng: 21.028,
    verified: true,
  },
  {
    id: "cg-ewa",
    name: "Ewa Nowak",
    age: 52,
    rating: 4.7,
    reviews: 97,
    distanceKm: 3.1,
    hourlyRate: 37,
    availableLabel: "Dostępna od piątku",
    yearsExperience: 9,
    compatibility: 87,
    avatarGradient: "from-teal-200/80 via-white/70 to-cyan-300/60",
    specializations: [
      { id: "meals", label: "Posiłki" },
      { id: "meds", label: "Leki" },
      { id: "companionship", label: "Spacery" },
    ],
    whyMatch: [
      "Najwyższa liczba opinii w tej okolicy.",
      "Specjalizuje się w codziennej opiece domowej.",
      "Może wspierać przy lekach i przygotowaniu posiłków.",
    ],
    lat: 52.198,
    lng: 21.035,
    verified: false,
  },
];

export const familyNeeds: CareNeed[] = [
  {
    id: "need-1",
    title: "Opieka dzienna dla mamy po szpitalu",
    district: "Mokotów",
    hours: "Pn–Pt · 09:00–15:00",
    budget: "34–38 zł/h",
    needs: [
      { id: "need-companion", label: "Towarzyszenie" },
      { id: "need-rehab", label: "Po hospitalizacji" },
      { id: "need-shopping", label: "Zakupy" },
    ],
    lat: 52.207,
    lng: 21.022,
  },
  {
    id: "need-2",
    title: "Pomoc 3x w tygodniu",
    district: "Służew",
    hours: "Wt, Czw, Sob · 10:00–14:00",
    budget: "32–35 zł/h",
    needs: [
      { id: "need-dementia", label: "Demencja" },
      { id: "need-meals", label: "Posiłki" },
      { id: "need-medications", label: "Leki" },
    ],
    lat: 52.191,
    lng: 21.01,
  },
];

export const mapCenter = {
  lat: 52.2058,
  lng: 21.0225,
  district: "Mokotów, Warszawa",
};

/** All unique specialization tags across caregivers — used as filter chips */
export const allSpecializations = Array.from(
  new Map(
    caregivers.flatMap((c) => c.specializations).map((tag) => [tag.id, tag]),
  ).values(),
);
