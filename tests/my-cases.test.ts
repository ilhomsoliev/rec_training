import { describe, expect, it } from "vitest";
import { filterActivities, rankActivities, recommend, SCORING } from "../src/engine.js";
import { DEFAULT_FILTERS, type Activity } from "../src/types.js";

function idea(id: string, overrides: Partial<Activity> = {}): Activity {
  return {
    id,
    title: id,
    category: "games",
    locations: ["outdoors", "home"],
    minParticipants: 3,
    maxParticipants: 5,
    durationMinutes: 60,
    estimatedCostPerPerson: 0,
    moods: ["social"],
    tags: ["board-games"],
    isActive: true,
    ...overrides,
  };
}

describe("мои проверки рекомендательного движка", () => {
  it("принимает занятие на границах участников, времени и нулевого бюджета", () => {
    const activity = idea("boundary");
    const filters = {
      ...DEFAULT_FILTERS,
      participants: 3,
      availableMinutes: 60,
      budgetPerPerson: 0,
      location: "home" as const,
    };

    expect(filterActivities([activity], filters)).toEqual([activity]);
    expect(filterActivities([activity], { ...filters, participants: 5 })).toEqual([activity]);
  });

  it("возвращает invalid для некорректных фильтров", () => {
    const result = recommend([idea("a")], { ...DEFAULT_FILTERS, participants: 0 }, []);

    expect(result.kind).toBe("invalid");
    if (result.kind === "invalid") {
      expect(result.errors).not.toHaveLength(0);
    }
  });

  it("возвращает empty для изначально пустого каталога", () => {
    expect(recommend([], DEFAULT_FILTERS, [])).toEqual({ kind: "empty", eligibleCount: 0 });
  });

  it("возвращает exhausted, когда все подходящие занятия уже показаны", () => {
    expect(
      recommend([idea("shown")], { ...DEFAULT_FILTERS, participants: 3 }, [], ["shown"]),
    ).toEqual({ kind: "exhausted", eligibleCount: 1 });
  });

  it("не меняет порядок входного массива при ранжировании", () => {
    const activities = Object.freeze([idea("z"), idea("a")]);

    rankActivities(activities, { ...DEFAULT_FILTERS, availableMinutes: null }, []);

    expect(activities.map(activity => activity.id)).toEqual(["z", "a"]);
  });

  it("начисляет за повторяющийся тег только один бонус", () => {
    const activity = idea("tagged", { tags: ["board-games", "board-games"] });
    const [ranked] = rankActivities(
      [activity],
      { ...DEFAULT_FILTERS, availableMinutes: null, mood: "any" },
      [],
      ["board-games", "board-games"],
    );

    expect(ranked.score).toBe(SCORING.tag);
  });
});
