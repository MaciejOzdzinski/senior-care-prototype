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
    avatarUrl:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=160&h=160&fit=crop&crop=face",
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
    reviewList: [
      {
        id: "rev-anna-1",
        author: "Katarzyna M.",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        date: "2 tygodnie temu",
        text: "Anna opiekowała się moją mamą przez 3 miesiące. Bardzo cierpliwa, zawsze uśmiechnięta. Mama polubila ją od pierwszego dnia.",
      },
      {
        id: "rev-anna-2",
        author: "Tomasz W.",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        date: "miesiąc temu",
        text: "Profesjonalna i punktualna. Świetnie radzi sobie z osobami z demencją. Gorąco polecam!",
      },
      {
        id: "rev-anna-3",
        author: "Magdalena K.",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
        rating: 4,
        date: "2 miesiące temu",
        text: "Bardzo dobra opieka. Babcia chętnie z nią spędza czas na spacerach i rozmowach.",
      },
    ],
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
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
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
    reviewList: [
      {
        id: "rev-marek-1",
        author: "Joanna P.",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        date: "tydzień temu",
        text: "Marek pomógł tacie wrócić do formy po operacji biodra. Cierpliwy i profesjonalny, tata czuł się bezpiecznie.",
      },
      {
        id: "rev-marek-2",
        author: "Robert N.",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        date: "3 tygodnie temu",
        text: "Fantastyczny opiekun wieczorny. Zawsze na czas, dziadek go bardzo polubił.",
      },
    ],
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
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face",
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
    reviewList: [
      {
        id: "rev-ewa-1",
        author: "Anna S.",
        avatarUrl:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        date: "5 dni temu",
        text: "Ewa gotuje piękne domowe obiady, mama w końcu zaczęła jeść z apetytem. Złote ręce i złote serce.",
      },
      {
        id: "rev-ewa-2",
        author: "Piotr L.",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
        rating: 4,
        date: "2 tygodnie temu",
        text: "Bardzo doświadczona opiekunka. Zna się na lekach i pilnuje regularności przyjmowania. Spokojnie powierzam jej opiekę.",
      },
      {
        id: "rev-ewa-3",
        author: "Maria D.",
        avatarUrl:
          "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        date: "miesiąc temu",
        text: "Niech Bóg błogosławi takie osoby. Ewa to najlepsza rzecz, jaka spotkala naszą rodzinę.",
      },
    ],
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
