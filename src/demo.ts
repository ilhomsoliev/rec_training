import { catalog } from "./data/catalog.js";
import { recommend, type RecommendationResult } from "./engine.js";
import { DEFAULT_FILTERS, SURPRISE_FILTERS } from "./types.js";

function printResult(title: string, result: RecommendationResult): void {
  console.log(`${title}:`);

  if (result.kind === "success") {
    console.log("Результат: рекомендация найдена");
    console.log("Занятие:", result.recommendation.activity.title);
    console.log("Баллы:", result.recommendation.score);
    console.log("Почему:", result.recommendation.reasons.join("; "));
    console.log("Подходящих занятий:", result.eligibleCount);
    console.log("Можно предложить ещё:", result.remainingCount);
  } else if (result.kind === "invalid") {
    console.log("Результат: некорректные параметры");
    console.log("Ошибки:", result.errors.join("; "));
  } else {
    console.log(`Результат: ${result.kind === "empty" ? "подходящих занятий нет" : "варианты закончились"}`);
    console.log("Подходящих занятий:", result.eligibleCount);
  }

  console.log("");
}

const interests = ["games"] as const;
const first = recommend(catalog, DEFAULT_FILTERS, interests, [], () => 0);
printResult("Обычный подбор", first);

if (first.kind === "success") {
  const next = recommend(
    catalog,
    DEFAULT_FILTERS,
    interests,
    [first.recommendation.activity.id],
    () => 0,
  );
  printResult("После «Другое»", next);
}

const surprise = recommend(catalog, SURPRISE_FILTERS, [], [], () => 0.5);
printResult("Режим «Удиви меня»", surprise);

const noMatches = recommend(catalog, { ...DEFAULT_FILTERS, availableMinutes: 10 }, []);
printResult("Нет подходящих активностей", noMatches);

const invalidBudget = recommend(catalog, { ...DEFAULT_FILTERS, budgetPerPerson: -1 }, []);
printResult("Некорректный бюджет", invalidBudget);
