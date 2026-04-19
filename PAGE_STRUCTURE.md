# Структура страницы (разметка и техника, без текстового контента)

Актуально для: **`src/pages/index.astro`** + оболочка **`src/layouts/Base.astro`**. Тайский текст заголовков, абзацев и подписей здесь не перечисляется — только дерево DOM, классы, `id`, формы, скрипты и подключения.

---

## Корень документа (`Base.astro`)

| Элемент | Атрибуты / содержимое |
|--------|------------------------|
| `<html>` | `lang="th"` |
| `<head>` | `meta charset`, `meta viewport`, `<title>` из пропа `title` у `<Base>`, preconnect + Google Fonts **Inter** (400–800) |
| `<body>` | `data-form-endpoint`, `data-form-method`, `data-form-id`, `data-success-url` — источник для `FORM_CONFIG` |
| После `<slot />` | Inline: `window.iFrameResizer`, CDN **`@iframe-resizer/child@5.5.9`**, затем блок с **`FORM_CONFIG`**, `getDigitsOnly`, `fireSuccessPixel`, на `DOMContentLoaded`: привязка `#constructor-fallback-form` к endpoint + **IntersectionObserver** для `.glass` / `.glass-strong` (классы `will-reveal` / `revealed`; исключения: `.topline`, `.hero-shell`, `.faq-item`) |

Слот страницы: в `index.astro` внутрь `<Base>` попадает **`import '../styles/global.css'`** и разметка ниже.

---

## Обёртка страницы (`index.astro`)

```
<Base title="…">
  <div class="page">
    …секции по порядку…
  </div>
</Base>
```

Класс **`.page`** — из `global.css` (`position: relative`, `z-index: 1`).

---

## Порядок секций (как в DOM сверху вниз)

| # | Компонент | Файл | Корневой тег / оболочка | Якоря (`id`) и прочие структурные метки |
|---|------------|------|-------------------------|----------------------------------------|
| 1 | **Topline** | `Topline.astro` | `<div class="topline">` → `.container` → `.topline-inner.glass` | Без секционного `id` |
| 2 | **Hero** | `Hero.astro` | `<section class="hero">` | Блок лида: `#hero-inline-order` (`tabindex="-1"`). Внутри: `#heroInlineFormWrap`, поля `#hero-inline-name`, `#hero-inline-phone`, кнопка `#heroInlineSubmitBtn`, скрытая отправка `#hero-fallback-form` + iframe `name="hero-order-submit-frame"`, экран успеха `#heroInlineThankYou` (`hidden` до отправки). **`<script is:inline>`** — отправка hero-формы (без глобальной делегации «скролл к форме») |
| 3 | **TrustStrip** | `TrustStrip.astro` | `<div class="trust-strip">` → `.container` → `.row` | Без секционного `id` |
| 4 | **Problems** | `Problems.astro` | `<section class="section">` | Секции без `id` в корне |
| 5 | **VideoFeedback** | `VideoFeedback.astro` | `<section class="section">` | Обычно видео + сетка отзывов (структура карточек) |
| 6 | **OrderForm** (первая) | `OrderForm.astro` | `<section class="section" id="order-form">` | Якорь **`#order-form`** (дублируется вторым блоком — см. примечание ниже). Поля `#name`, `#phone`, кнопка с `onclick="handleOrder(this)"`, `#constructor-fallback-form` + iframe `constructor-submit-frame`. **`<script is:inline>`** — `handleOrder`, fetch + fallback |
| 7 | **Comparison** | `Comparison.astro` | `<section class="section" id="comparison">` | Якорь **`#comparison`** |
| 8 | **Mechanism** | `Mechanism.astro` | `<section class="section" id="mechanism">` | Якорь **`#mechanism`** |
| 9 | **Ingredients** | `Ingredients.astro` | `<section class="section">` | Без корневого `id` |
| 10 | **Regulatory** | `Regulatory.astro` | `<section class="section">` | Без корневого `id` |
| 11 | **Timeline** | `Timeline.astro` | `<section class="section">` | Без корневого `id` |
| 12 | **ClientResults** | `ClientResults.astro` | `<section class="section results-section" id="client-results">` | **`#client-results`**, внутри `#resultsVault` + `data-results-stage`. **`<script is:inline>`** — слайдер/«хранилище» результатов |
| 13 | **MiniCTA** | `MiniCTA.astro` | `<div class="mini-cta">` → `.container` (если не `embed`) | В `index`: **`<MiniCTA instance="page" />`**. Корень: `.mini-cta`, опционально **`.mini-cta--embed`**. Поля и iframe с суффиксом инстанса: `#mini-name-{instance}`, `#mini-phone-{instance}`, `#mini-fallback-{instance}`, `name="mini-order-{instance}"`. **`<script is:inline>`** — отправка мини-формы |
| 14 | **Comments** | `Comments.astro` | `<section class="section" id="real-comments">` | **`#real-comments`**, `#comments-scroll`, `#comments-container`. **`<script is:inline>`** — симулятор/скролл комментариев |
| 15 | **Offer** | `Offer.astro` | `<section class="section" id="offer">` | Якорь **`#offer`**. В карточке оффера встроена **`<MiniCTA instance="offer" embed />`** (компактный блок без обёртки `.container` у мини-формы) |
| 16 | **OrderForm** (вторая) | `OrderForm.astro` | `<section class="section" id="order-form">` | Тот же шаблон, что и первая — в DOM появляются **два** элемента с **`id="order-form"`** и дубли `#name` / `#phone` (осознанный компромисс для потока страницы; якорь и `querySelector` по `id` неоднозначны) |
| 17 | **DeliveryFaq** | `DeliveryFaq.astro` | `<section class="section">` | **`<script is:inline>`** — FAQ (раскрытие) |
| 18 | **Footer** | `Footer.astro` | `<footer>` → `.container` → `.footer-card.glass` | Без `id` |

---

## Дублирование `OrderForm` на одной странице

В **`index.astro`** монтируются **две** секции **`<OrderForm />`**. Обе рендерят одинаковые **`id`** секции и полей. Если нужна уникальность для якорей, автотестов или скриптов — потребуется параметризация компонента (`id` префикса / суффикса).

---

## Мини-формы (`MiniCTA.astro`)

| Проп | Назначение |
|------|------------|
| **`instance`** | Строка, по умолчанию `"1"`. Должна быть **уникальна** на странице для всех полей, iframe и скрытого fallback. Примеры в проекте: `page`, `offer`; при подключении липких блоков — `stickybar`, `stickycta`. |
| **`embed`** | `true` — вариант для вставки внутрь карточки или полосы: класс **`mini-cta--embed`**, без внешнего `.container` у корня мини-блока, компактная вёрстка. |

Дополнительные лиды в **`Offer`** и (при использовании в разметке) **`StickyBar`**, **`StickyCTA`** реализованы через **`<MiniCTA … embed />`**, а не через кнопки «скролл к форме».

---

## Глобальные стили

- Подключаются один раз в **`index.astro`**: `import '../styles/global.css'`.
- Типовые паттерны: **`.section`**, **`.container`**, **`.glass` / `.glass-strong`**, сетки, кнопки **`.btn-primary`**, поля **`.field`**, правило **`[hidden] { display: none !important; }`** и т.д.

---

## Формы и лиды (структура, не URL)

| Место | Механика |
|-------|----------|
| **`<body>`** | Параметры формы дублируются в query через `FORM_CONFIG` (см. `Base.astro`). |
| **Hero** | Основной лид вверху страницы: `fetch` + при ошибке POST через **`#hero-fallback-form`** в iframe. Успех: показ `#heroInlineThankYou`, скрытие `#heroInlineFormWrap`. |
| **OrderForm** | Полноформенная заявка (на странице — **два экземпляра**): функции в inline-скрипте компонента, **`#constructor-fallback-form`** — на `DOMContentLoaded` в `Base` подставляются `action`/`method`/`form_id`; отправка согласована с тем же endpoint. |
| **MiniCTA** | Отдельный поток отправки в inline-скрипте компонента: свои поля и fallback-форма на инстанс, тот же общий endpoint через `FORM_CONFIG` / тело запроса по аналогии с остальными формами. |
| **Пиксель успеха** | `fireSuccessPixel()` в `Base.astro` — скрытый iframe на `successUrl`. |

---

## Скрипты по компонентам (кроме Base)

| Компонент | Inline-скрипт |
|-----------|----------------|
| Hero | Да |
| Comments | Да |
| ClientResults | Да |
| OrderForm | Да |
| MiniCTA | Да |
| DeliveryFaq | Да |

Остальные перечисленные секции в типовом случае обходятся разметкой + глобальным/локальным CSS без отдельного `<script is:inline>` в файле компонента (проверяйте при изменениях).

---

## Компоненты в репозитории, но не в текущем `index.astro`

На странице **не монтируются**, но файлы есть в `src/components/`:

- **`BlackGalangalResearch.astro`** — секция с `id="black-galangal-research"` (раньше могла стоять в потоке).
- **`StickyCTA.astro`**, **`StickyBar.astro`** — липкие CTA с встроенной **`<MiniCTA embed />`** (при подключении в страницу задавать уникальный **`instance`**).

---

## Медиа и пути

- Статика: каталог **`public/`**, в разметке пути вида **`/assets/...`** (изображения, видео и т.д.).
- Сборка: Astro → статический **`dist/index.html`** (CSS часто инлайнится согласно `astro.config.mjs`).

---

## Контекст iframe (только факт для вёрстки)

Страница рассчитана на встраивание в iframe родителя: подключён **iframe-resizer child**; глобально не используется **`position: fixed`** для «липких» панелей (см. правила проекта). Поведение якорей и скролла зависит и от родителя; повторные точки входа в заявку — через **мини-формы** и полноразмерные **OrderForm**, а не через единый «скролл к одному якорю».

---

*При изменении порядка секций или `id` обновляйте этот файл вместе с `index.astro`, чтобы документация не расходилась с DOM.*
