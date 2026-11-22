# 08. «Другое» и четыре исхода подбора

Представь: пользователь уже посмотрел две идеи, но хочет третью. Нам не нужно придумывать сложную память в самой функции — передадим ей **список ID уже показанных занятий**.

```typescript
const shown = new Set(["a", "b"]);
const remaining = [{ id: "a" }, { id: "b" }, { id: "c" }]
  .filter((item) => !shown.has(item.id));
// remaining: [{ id: "c" }]
```

При новом вызове `recommend` получает обновлённый список `shownIds`. Если пользователь поменял условия и начинает новую серию, приложение передаст пустой список.

## Четыре исхода

| `kind` | Что означает |
|---|---|
| `invalid` | Параметры неправильные — есть `errors` |
| `empty` | Ни одна активность не удовлетворяет жёстким ограничениям |
| `exhausted` | Подходящие есть, но **все уже показаны в этой серии** |
| `success` | Найдена новая рекомендация с баллами и причинами |

Тип `RecommendationResult` уже описан в `src/engine.ts`. Он специально сделан **discriminated union**: проверяешь `result.kind`, и TypeScript понимает, какие поля есть у результата.

### Маленький пример разбора

```typescript
type DemoResult = { kind: "success"; id: string } | { kind: "empty" };

function printResult(result: DemoResult): string {
  if (result.kind === "empty") return "Ничего не найдено";
  return `Нашли: ${result.id}`;
}
```

Порядок проверки важен: сначала `invalid`, затем `empty`, потом `exhausted`, и только после — выбор активности.

[Задание 06](../exercises/06-series.md).
