# CMS Wydarzenia - Kompletny przewodnik po polach

## Przegląd wszystkich pól w schemacie `event`

### 📝 Podstawowe informacje

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `title` | string | ✅ | Tytuł wydarzenia (np. "ENSEMBLE KOMPOPOLEX") |
| `date` | datetime | ✅ | Data i godzina wydarzenia (np. "13.12.25 18:00") |
| `location` | text | ✅ | Lokalizacja wydarzenia (np. "ASP WROCŁAW, PL. POLSKI 3/4") |
| `description` | text | ✅ | Opis wydarzenia - pojawia się pod zdjęciem |

### 👥 Wykonawcy i Program

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `performers` | text | ❌ | Wykonawcy (np. "Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski") |
| `program` | array | ❌ | Lista utworów w programie |
| `program[].composer` | string | ✅* | Kompozytor utworu |
| `program[].piece` | string | ✅* | Tytuł utworu |

*Wymagane jeśli dodajesz utwór do programu

### 🎨 Media

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `image` | image | ✅ | Główne zdjęcie wydarzenia (poster) |

### 🎟️ Bilety

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `ticketUrl` | url | ❌ | Link do strony z biletami (np. "https://bilety.kompopolex.pl/...") |
| `showTicketButton` | boolean | ❌ | Czy wyświetlić przycisk "KUP BILET" (domyślnie: false) |

**Uwaga**: Przycisk "KUP BILET" pojawi się tylko gdy:
- `showTicketButton` = **true**
- `ticketUrl` jest ustawiony

### 🤝 Partnerzy

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `partners` | array | ❌ | Lista partnerów wydarzenia |
| `partners[].name` | string | ✅* | Nazwa partnera (np. "Miasto Wrocław") |
| `partners[].logo` | image | ✅* | Logo partnera |

*Wymagane jeśli dodajesz partnera

**Domyślni partnerzy** (dodani automatycznie do wszystkich wydarzeń):
1. Miasto Wrocław
2. ZAIKS
3. Recepcja
4. Polmic

### 📊 Status i Publikacja

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `status` | string | ✅ | Status wydarzenia: "upcoming" lub "archived" |
| `publishedAt` | datetime | ❌ | Data publikacji - wydarzenie pojawi się na stronie tylko gdy to pole jest wypełnione |

## Status wydarzenia

### 🟢 Nadchodzące (upcoming)
- Wyświetlane na stronie `/kalendarz`
- Sortowane według daty rosnąco (najwcześniejsze na górze)
- Wyświetlane maksymalnie 3 wydarzenia

### 📦 Archiwalne (archived)
- Wyświetlane na stronie `/archiwalne`
- Sortowane według daty malejąco (najnowsze na górze)
- Wyświetlane w siatce 3 kolumn

## Workflow w CMS

### Tworzenie nowego wydarzenia

1. **Otwórz Sanity Studio**: http://localhost:3333
2. **Kalendarz → Nadchodzące** (lub Archiwalne)
3. **Utwórz nowe wydarzenie**
4. **Wypełnij pola**:
   - ✅ Tytuł
   - ✅ Data i godzina
   - ✅ Lokalizacja
   - ✅ Opis
   - ✅ Zdjęcie (upload)
   - ❌ Wykonawcy (opcjonalne)
   - ❌ Program (opcjonalne - dodaj utwory)
   - ❌ Link do biletu (opcjonalne)
   - ❌ Pokaż przycisk biletu (tylko jeśli masz link)
   - ❌ Partnerzy (opcjonalne - domyślnie są już dodani)
   - ✅ Status: Nadchodzące
5. **Ustaw datę publikacji** (`publishedAt`) - wydarzenie pojawi się na stronie
6. **Zapisz**

### Przeniesienie wydarzenia do archiwum

1. Otwórz wydarzenie
2. Zmień **Status** z "Nadchodzące" na "Archiwalne"
3. Zapisz
4. Wydarzenie automatycznie przeniesie się na stronę `/archiwalne`

### Dodawanie/edycja partnerów

**Dla pojedynczego wydarzenia**:
1. Otwórz wydarzenie
2. Scrolluj do sekcji "Partnerzy"
3. Kliknij "Add item"
4. Wpisz nazwę partnera
5. Upload logo partnera
6. Zapisz

**Dla wszystkich wydarzeń** (resetowanie do domyślnych):
```bash
node scripts/add-partners-to-events.js
```

## Przykładowe wypełnienie

```
Tytuł: ENSEMBLE KOMPOPOLEX
Data i godzina: 2025-12-13T18:00:00
Lokalizacja: ASP WROCŁAW, PL. POLSKI 3/4
Opis: Koncert współczesnej muzyki eksperymentalnej...
Wykonawcy: Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski

Program:
  - Kompozytor: La Monte Young
    Utwór: Composition #10
  - Kompozytor: Marta Śniady
    Utwór: Body X Ultra
  - ...

Zdjęcie: [upload poster.jpg]
Link do biletu: https://bilety.kompopolex.pl/wydarzenie/1
Pokaż przycisk biletu: ✅ TAK

Partnerzy: (już dodani domyślnie)
  - Miasto Wrocław
  - ZAIKS
  - Recepcja
  - Polmic

Status: Nadchodzące
Data publikacji: 2025-01-17T14:00:00
```

## Testowanie

### Test 1: Nowe wydarzenie nadchodzące
```
http://localhost:5173/kalendarz → powinno pokazać nowe wydarzenie
Kliknij na wydarzenie → /wydarzenie/{ID} → wszystkie pola wyświetlone
```

### Test 2: Przycisk biletu
```
Ustaw: showTicketButton = true, ticketUrl = "https://example.com"
Odśwież stronę wydarzenia → przycisk "KUP BILET" powinien się pojawić
Kliknij przycisk → powinien otworzyć link w nowej zakładce
```

### Test 3: Partnerzy
```
Strona wydarzenia → scrolluj na dół → sekcja "Partnerzy"
Powinny być widoczne loga 4 partnerów
```

### Test 4: Archiwizacja
```
Zmień status wydarzenia na "Archiwalne"
http://localhost:5173/archiwalne → wydarzenie powinno się pojawić
http://localhost:5173/kalendarz → wydarzenie powinno zniknąć
```

## Najczęstsze problemy

### Wydarzenie nie pojawia się na stronie
✅ Sprawdź czy `publishedAt` jest ustawione
✅ Sprawdź czy `status` to "upcoming" (dla Kalendarz) lub "archived" (dla Archiwum)

### Brak przycisku biletu
✅ Sprawdź czy `showTicketButton` = true
✅ Sprawdź czy `ticketUrl` jest ustawiony

### Błąd ".map() on null"
✅ Problem naprawiony - `program` i `performers` mają teraz fallback values

### Brak partnerów
✅ Uruchom skrypt migracji: `node scripts/add-partners-to-events.js`
