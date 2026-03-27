# CareMatch — Design System

Oparty na **Apple Human Interface Guidelines (HIG)**. Obowiązuje w obu trybach pracy: `family` (niebieski) i `caregiver` (pomarańczowy).

---

## 1. Kolory

### Akcenty trybów

| Tryb      | Token     | Wartość   | Użycie                             |
| --------- | --------- | --------- | ---------------------------------- |
| Family    | `primary` | `#007AFF` | Przyciski, aktywne elementy, linki |
| Caregiver | `accent`  | `#FF9500` | Przyciski, aktywne elementy, linki |

### Kolory systemowe (wspólne)

| Nazwa            | Wartość      | Użycie                                         |
| ---------------- | ------------ | ---------------------------------------------- |
| `success`        | `#34C759`    | Odznaki „Zweryfikowany", wskaźniki dostępności |
| `warning`        | `#FF9500`    | Ostrzeżenia, akcent caregiver                  |
| `destructive`    | `#FF3B30`    | Przyciski niszczące, błędy                     |
| `primary-text`   | `#1c1c1e`    | Nagłówki, etykiety, główny tekst               |
| `secondary-text` | `#8e8e93`    | Opisy, podtytuły, placeholder                  |
| `separator`      | `#3c3c43/20` | Linie podziału (iOS separator)                 |
| `fill-tertiary`  | `#7676801f`  | Tag/chip tło (subtelne)                        |

### Tła ekranów

| Tryb      | Wartość               | Opis                                 |
| --------- | --------------------- | ------------------------------------ |
| Family    | `#f4f4f8`             | Chłodna szarość (grouped background) |
| Caregiver | `#f8f4f0` / `#f2ede8` | Ciepły beż (warm grouped background) |

---

## 2. Typografia

Font: **SF Pro** (system font stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)

| Styl          | Klasa Tailwind | Rozmiar | Tracking  | Waga              |
| ------------- | -------------- | ------- | --------- | ----------------- |
| Large Title   | —              | `34px`  | `+0.37px` | `700`             |
| Title 2       | `SectionTitle` | `20px`  | `+0.38px` | `600`             |
| Headline      | —              | `17px`  | `-0.41px` | `600`             |
| Body          | —              | `17px`  | `-0.41px` | `400`             |
| Callout       | —              | `16px`  | `-0.31px` | `400`             |
| Subheadline   | —              | `15px`  | `-0.23px` | `400`             |
| Footnote      | —              | `13px`  | `-0.08px` | `400`             |
| Caption       | —              | `12px`  | `0`       | `400`             |
| Section label | —              | `11px`  | `+0.07px` | `500` (uppercase) |

---

## 3. Kształty i zaokrąglenia

| Element                      | Wartość         | Klasa Tailwind    |
| ---------------------------- | --------------- | ----------------- |
| **Wszystkie przyciski CTA**  | `9999px` (pill) | `rounded-full` ✅ |
| Karty (GlassCard, SwipeCard) | `16px`          | `rounded-2xl`     |
| Odznaki (Badge)              | `9999px` (pill) | `rounded-full`    |
| Filter Chip                  | `9999px` (pill) | `rounded-full`    |
| Awatar / ikona akcji         | `9999px` (pill) | `rounded-full`    |
| Ikona statusu / dot          | `9999px`        | `rounded-full`    |

> **Zasada nadrzędna — przyciski mają zawsze kształt pill (`rounded-full`).**  
> Dotyczy to każdego klikalnego elementu wyglądającego jak przycisk: CTA na kartach, w sheetach, w nawigacji, w formularzach. Nie używaj `rounded-[Xpx]` dla przycisków — to odchyłka od DS.

---

## 4. Komponenty UI

### `<Button>`

Zdefiniowany w `src/components/ui/button.tsx` (CVA). Zawsze używaj tego komponentu zamiast surowego `<button>`.

**Warianty:**

| Variant       | Tło           | Tekst     | Zastosowanie           |
| ------------- | ------------- | --------- | ---------------------- |
| `primary`     | `#007AFF`     | biały     | Główna akcja CTA       |
| `secondary`   | `#f2f2f7`     | `#1c1c1e` | Akcja drugorzędna      |
| `ghost`       | transparentne | `#007AFF` | Akcje inline, linki    |
| `destructive` | `#FF3B30/10`  | `#FF3B30` | Kasowanie, wylogowanie |

> W trybie `caregiver` nadpisuj kolor primary przez `className="bg-[#FF9500] shadow-[0_2px_8px_rgba(255,149,0,0.3)]"` na komponencie `<Button variant="primary">`.

**Rozmiary:**

| Size   | Wysokość      | Padding | Tekst  |
| ------ | ------------- | ------- | ------ |
| `sm`   | `h-9` (36px)  | `px-4`  | `14px` |
| `md`   | `h-11` (44px) | `px-5`  | `14px` |
| `lg`   | `h-12` (48px) | `px-6`  | `15px` |
| `icon` | `h-11 w-11`   | —       | —      |

Minimalna szerokość dotykalnego obszaru: **44×44 pt** (HIG).

**Animacja (spring tap):**

```ts
whileTap={{ scale: 0.97, opacity: 0.7 }}
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

---

### `<GlassCard>`

```
rounded-2xl border border-black/4 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]
```

Użycie: karty listowe, sekcje na ekranach.

---

### `<Badge>`

```
h-7 rounded-full bg-[#e5e5ea] px-3 text-[12px] font-medium text-[#1c1c1e]/80
```

Użycie: specjalizacje, tagi, etykiety statusu.

---

### `<FilterChip>`

```
rounded-full px-3 py-1.5 text-[12px] font-semibold backdrop-blur-md
Aktywny:   bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.35)]
Nieaktywny: bg-white/80 text-[#1c1c1e]
```

---

### `<SectionTitle>`

```
text-[20px] font-semibold tracking-[0.38px] text-[#1c1c1e]
```

---

## 5. Nawigacja i kontenery

### Bottom Tab Bar

```
fixed bottom-0 left-0 right-0
bg-[#eeeef2]/72 backdrop-blur-2xl   ← family
bg-white/92 backdrop-blur-2xl        ← caregiver
border-t border-black/5
pb-[env(safe-area-inset-bottom)]
```

Wysokość: `56px` + safe area. Ikony: `22px`, etykiety: `10px` (`font-medium`).

### Sticky Header / Navigation Bar

```
sticky top-0 z-10
bg-[#f4f4f8]/72 backdrop-blur-2xl   ← family
bg-[#f2ede8]/72 backdrop-blur-2xl   ← caregiver
border-b border-black/5
```

### Glass Morphism (surface translucent)

```
bg-white/40 backdrop-blur-2xl border border-white/40
```

Użycie: karty nakładkowe, floating elementy.

---

## 6. Cienie (Elevation)

| Poziom           | Wartość                                   | Użycie                 |
| ---------------- | ----------------------------------------- | ---------------------- |
| Card / default   | `shadow-[0_2px_12px_rgba(0,0,0,0.08)]`    | GlassCard, karty       |
| Button primary   | `shadow-[0_2px_8px_rgba(0,122,255,0.30)]` | Główny CTA             |
| Button caregiver | `shadow-[0_2px_8px_rgba(255,149,0,0.30)]` | Główny CTA (caregiver) |
| Elevated sheet   | `shadow-[0_-4px_40px_rgba(0,0,0,0.12)]`   | Bottom sheets          |

---

## 7. Bottom Sheet / Drawer

Biblioteka: **Vaul** (`<Drawer>`).

- Grabber: `w-9 h-[5px] rounded-full bg-[#3c3c43]/20 mx-auto mb-5`
- Tło: `bg-white rounded-t-[20px]`
- Główny CTA na dole: `rounded-full h-12` (lub `h-[50px]`) `w-full`
- Padding boczny: `px-5`, dolny: `pb-[max(env(safe-area-inset-bottom),20px)]`

---

## 8. Animacje

Wszystkie interaktywne elementy używają spring — brak liniowych `ease-in-out` dla tap-reakcji.

```ts
// Standard tap spring
{ type: "spring", stiffness: 300, damping: 20 }

// Wejście karty (SwipeCard)
initial: { scale: 0.95, opacity: 0 }
animate: { scale: 1, opacity: 1 }
transition: { type: "spring", stiffness: 260, damping: 24 }
```

Swipe threshold: `|offset.x| > 80px` → akcja (like / skip).

---

## 9. Ikony

Biblioteka: **Lucide React**.  
Rozmiar standardowy: `20px` (ikony akcji), `22px` (tab bar), `16px` (inline/badge).

---

## 10. Odstępy i siatka

| Token              | Wartość | Klasa   |
| ------------------ | ------- | ------- |
| Padding ekranu     | `16px`  | `px-4`  |
| Padding karty      | `16px`  | `p-4`   |
| Gap między kartami | `12px`  | `gap-3` |
| Gap sekcji         | `24px`  | `gap-6` |

---

## 11. Dane i lokalizacja

- Język UI: **polski**
- Mock data: Unsplash obrazy z parametrami `w=160&h=160&fit=crop&crop=face`
- Lokalizacja: **Warszawa** (dzielnice: Mokotów, Wilanów, Śródmieście, Służew, Żoliborz…)

---

## 12. Decyzje projektowe (ADR)

| #      | Decyzja                                                      | Uzasadnienie                                                                                                                                           |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ADR-01 | Przyciski zawsze `rounded-full` (pill)                       | Spójność z `Button` UI (CVA base class), Apple HIG prominent CTA shape, uniknięcie przypadkowych wartości `rounded-[12/13/14px]` w surowych `<button>` |
| ADR-02 | Dwa oddzielne akcenty trybów (niebieski / pomarańczowy)      | Jasne rozróżnienie kontekstu pracy bez zmiany typografii ani układu                                                                                    |
| ADR-03 | Stan tylko w `useState` w `App.tsx` (bez zewnętrznego store) | Prototyp — minimalna złożoność, brak potrzeby Zustand/Redux                                                                                            |
| ADR-04 | Nawigacja oparta na `screen` state (bez routera)             | SPA mobile-first, brak URL-based navigation w prototypie                                                                                               |
| ADR-05 | `localStorage` do persystencji sesji                         | Brak backendu — `carematch_has_account`, `carematch_first_name`, `carematch_family_auth`                                                               |
