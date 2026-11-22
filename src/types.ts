/** Всё, что нужно знать о занятиях и параметрах подбора. */
export const CATEGORIES = ["walks", "games", "creative", "sport", "culture"] as const;
export type Category = (typeof CATEGORIES)[number];

export const LOCATIONS = ["home", "outdoors", "venue"] as const;
export type Location = (typeof LOCATIONS)[number];

export const MOODS = ["calm", "active", "social", "creative"] as const;
export type Mood = (typeof MOODS)[number];

export interface Activity {
  readonly id: string;
  readonly title: string;
  readonly category: Category;
  readonly locations: readonly Location[];
  readonly minParticipants: number;
  readonly maxParticipants: number;
  readonly durationMinutes: number;
  readonly estimatedCostPerPerson: number;
  readonly moods: readonly Mood[];
  readonly tags: readonly string[];
  readonly isActive: boolean;
}

export interface Filters {
  /** null: число участников не ограничивает поиск */
  participants: number | null;
  /** null: время не ограничено */
  availableMinutes: number | null;
  /** null: бюджет не ограничен; 0 означает «только бесплатно» */
  budgetPerPerson: number | null;
  location: Location | "any";
  mood: Mood | "any";
}

export const DEFAULT_FILTERS: Filters = {
  participants: 2,
  availableMinutes: 90,
  budgetPerPerson: 500,
  location: "any",
  mood: "any",
};

export const SURPRISE_FILTERS: Filters = {
  participants: null,
  availableMinutes: null,
  budgetPerPerson: null,
  location: "any",
  mood: "any",
};
