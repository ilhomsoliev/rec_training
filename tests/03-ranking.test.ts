import { describe, expect, it } from "vitest";
import { rankActivities, SCORING } from "../src/engine.js";
import { DEFAULT_FILTERS, type Activity } from "../src/types.js";

function idea(id: string, overrides: Partial<Activity> = {}): Activity {
  return {
    id, title: id, category: "games", locations: ["home"],
    minParticipants: 1, maxParticipants: 5, durationMinutes: 70,
    estimatedCostPerPerson: 0, moods: ["social"], tags: ["компания"], isActive: true,
    ...overrides,
  };
}
const filters = { ...DEFAULT_FILTERS, availableMinutes: 90, mood: "social" as const };

describe("03 — баллы, причины и сортировка", () => {
  it("добавляет баллы за настроение", () => {
    const list = rankActivities([idea("a", { moods: ["social"] }), idea("b", { moods: ["calm"] })], filters, []);
    expect(list[0].activity.id).toBe("a");
    expect(list[0].score - list[1].score).toBe(SCORING.mood);
  });
  it("интересы улучшают рейтинг, но не отсекают категории", () => {
    const result = rankActivities([idea("a", { category: "walks" }), idea("b", { category: "games" })], filters, ["games"]);
    expect(result).toHaveLength(2);
    expect(result[0].activity.id).toBe("b");
    expect(result[0].score - result[1].score).toBe(SCORING.interest);
  });
  it("начисляет один бонус за теги даже при повторах", () => {
    const result = rankActivities([idea("a")], filters, [], ["компания", "компания"]);
    expect(result[0].score).toBe(SCORING.mood + SCORING.tag + SCORING.timeFit);
  });
  it("оценивает близость длительности", () => {
    const list = rankActivities([idea("a", { durationMinutes: 10 }), idea("b", { durationMinutes: 70 })], filters, []);
    expect(list[0].activity.id).toBe("b");
    expect(list[0].score - list[1].score).toBe(SCORING.timeFit);
  });
  it("не начисляет настроение при any", () => {
    const list = rankActivities([idea("a")], { ...filters, mood: "any", availableMinutes: null }, []);
    expect(list[0].score).toBe(0);
    expect(list[0].reasons.length).toBeGreaterThan(0);
  });
  it("сортирует по id при равных баллах и не меняет входные данные", () => {
    const values = Object.freeze([idea("z"), idea("a")]);
    const list = rankActivities(values, filters, []);
    expect(list.map(x => x.activity.id)).toEqual(["a", "z"]);
    expect(values.map(x => x.id)).toEqual(["z", "a"]);
  });
});
