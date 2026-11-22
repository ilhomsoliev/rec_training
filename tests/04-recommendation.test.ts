import { describe, expect, it } from "vitest";
import { recommend } from "../src/engine.js";
import { DEFAULT_FILTERS, SURPRISE_FILTERS, type Activity } from "../src/types.js";

function idea(id: string, overrides: Partial<Activity> = {}): Activity {
  return {
    id, title: id, category: "games", locations: ["home"], minParticipants: 1,
    maxParticipants: 10, durationMinutes: 30, estimatedCostPerPerson: 0,
    moods: ["calm"], tags: ["настолки"], isActive: true, ...overrides,
  };
}
const filters = { ...DEFAULT_FILTERS, participants: 2, location: "home" as const };

describe("04 — полная рекомендация", () => {
  it("возвращает invalid при некорректных параметрах", () => {
    const result = recommend([idea("a")], { ...filters, participants: 0 }, []);
    expect(result.kind).toBe("invalid");
    if (result.kind === "invalid") expect(result.errors.length).toBeGreaterThan(0);
  });
  it("возвращает empty, если нет допустимых вариантов", () => {
    expect(recommend([idea("a", { estimatedCostPerPerson: 1000 })], filters, []).kind).toBe("empty");
  });
  it("возвращает exhausted, если все подходящие уже показаны", () => {
    const result = recommend([idea("a")], filters, [], ["a"]);
    expect(result).toEqual({ kind: "exhausted", eligibleCount: 1 });
  });
  it("не повторяет уже показанные идеи", () => {
    const result = recommend([idea("a"), idea("b")], filters, [], ["a"], () => 0);
    expect(result.kind).toBe("success");
    if (result.kind === "success") {
      expect(result.recommendation.activity.id).toBe("b");
      expect(result.eligibleCount).toBe(2);
      expect(result.remainingCount).toBe(0);
    }
  });
  it("новая серия допускает показ прежней идеи", () => {
    expect(recommend([idea("a")], filters, [], [], () => 0).kind).toBe("success");
  });
  it("выбирает из не более 10 лучших", () => {
    const list = Array.from({ length: 15 }, (_, i) => idea(String(i).padStart(2, "0")));
    const first = recommend(list, filters, [], [], () => 0.999);
    expect(first.kind).toBe("success");
    if (first.kind === "success") expect(first.recommendation.activity.id).toBe("09");
    const next = recommend(list, filters, [], list.slice(0, 10).map(x => x.id), () => 0);
    if (next.kind === "success") expect(next.recommendation.activity.id).toBe("10");
    else throw new Error("После 10 просмотренных должны остаться другие занятия");
  });
  it.each([1, -1, Number.NaN, Number.POSITIVE_INFINITY])("не падает на неверном random %s", (r) => {
    expect(recommend([idea("a")], filters, [], [], () => r).kind).toBe("success");
  });
  it("передаёт предпочтительные теги в ранжирование", () => {
    const result = recommend([idea("a")], filters, [], [], () => 0, ["настолки"]);
    if (result.kind !== "success") throw new Error("Ожидается рекомендация");
    expect(result.recommendation.score).toBeGreaterThan(0);
    expect(result.recommendation.reasons.length).toBeGreaterThan(0);
  });
  it("свободный режим исключает архивные занятия", () => {
    const result = recommend([idea("a", { isActive: false }), idea("b")], SURPRISE_FILTERS, [], [], () => 0);
    if (result.kind !== "success") throw new Error("Ожидается рекомендация");
    expect(result.recommendation.activity.id).toBe("b");
  });
});
