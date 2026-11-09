# Autószerviz-kezelő – Fejlesztői dokumentáció

Az autószerviz-kezelő alkalmazás a szerviz működéséhez kapcsolódó adatok és folyamatok kezelésére szolgáló webalkalmazás. A dokumentáció a projekt felépítését, a frontend komponenseit és azok használatát mutatja be, elsősorban a további fejlesztést segítve.

## Újrafelhasználható komponensek

### [StatusBadge.vue](fullstack/frontend/src/components/reusable/StatusBadge.vue)

A `StatusBadge` egy újrafelhasználható Vue komponens, amely különböző állapotok vizuális megjelenítésére szolgál (pl. „Függőben”, „Jóváhagyva”, „Lemondva”).

A komponens egyetlen `status` propot vár, amely egy JavaScript-objektumként tartalmazza a megjelenítéshez szükséges adatokat.

**Használat:**

Egyetlen állapot megjelenítése:

```vue
<StatusBadge :status="statusCodes[4]" />
```

Több állapot megjelenítése listából:

```vue
<StatusBadge
    v-for="statusCode in statusCodes"
    :key="statusCode.name"
    :status="statusCode"
/>
```

**A `status` objektum felépítése:**

```js
{
    name: 'Lemondva',
    fontColor: 'danger',
    backgroundColor: 'danger-soft',
    displayBackground: true
}
```

| Paraméter | Típus | Leírás |
|---|---|---|
| `name` | `string` | A megjelenítendő szöveg, vagyis az állapot neve. |
| `fontColor` | `string` | A szöveg színe. Megadható a `colors.css` egyik színtokenjének nevével vagy közvetlen CSS-színként (pl. `#abc`, `rgb(...)`). |
| `backgroundColor` | `string` | A háttér színe. Ugyanúgy színtoken neve vagy közvetlen CSS-szín adható meg. |
| `displayBackground` | `boolean` | Meghatározza, hogy megjelenjen-e a lekerekített háttér. `true` esetén megjelenik, `false` esetén csak a színes szöveg látható. Alapértelmezett értéke `true`. |

**Fontos tudnivalók:**

- A `fontColor` és `backgroundColor` mezők színtokenekkel és hagyományos CSS-színértékekkel is használhatók.
- A projekt színrendszerének egységessége érdekében lehetőség szerint a `colors.css`-ben definiált tokeneket használd.
- A `displayBackground` elhagyható, ilyenkor a komponens alapértelmezetten megjeleníti a hátteret.
- A komponens használatakor mindig a teljes `status` objektumot add át a `status` propnak.

### [ActionButton.vue](fullstack/frontend/src/components/reusable/ActionButton.vue)

Az `ActionButton` egy újrafelhasználható Vue komponens, amely különböző műveletek indítására szolgáló gombok megjelenítésére használható (pl. „Jóváhagy”, „Elutasít”, „Megnyit”).

A komponens egy `action` és egy `payload` propot vár. Az `action` egy JavaScript-objektumként tartalmazza a gomb megjelenítéséhez és azonosításához szükséges adatokat, míg a `payload` a művelet végrehajtásához szükséges kiegészítő adatokat (pl. egy foglalás azonosítóját) adja át.

**Használat:**

```vue
<ActionButton
    :action="actionButtons[0]"
    :payload="appointment.id"
    @action="handleAction"
/>
```

**Az `action` objektum felépítése:**

```js
{
    key: 'approve',
    name: 'Jóváhagy',
    fontColor: 'accent-text',
    backgroundColor: 'accent',
    borderColor: 'danger'
}
```

| Paraméter | Típus | Leírás |
|---|---|---|
| `key` | `string` | A művelet egyedi azonosítója. A szülő komponens ez alapján határozza meg, hogy milyen műveletet kell végrehajtani. |
| `name` | `string` | A gombon megjelenítendő szöveg. |
| `fontColor` | `string` | A szöveg színe. Megadható a `colors.css` egyik színtokenjének nevével vagy közvetlen CSS-színként (pl. `#abc`, `rgb(...)`). |
| `backgroundColor` | `string` | A gomb háttérszíne. Ugyanúgy színtoken neve vagy közvetlen CSS-szín adható meg. A `transparent` érték is használható. |
| `borderColor` | `string` | Opcionális keretszín. Ugyanúgy színtoken neve vagy közvetlen CSS-szín adható meg. |

**Eseménykezelés:**

A komponens önállóan nem hajtja végre a hozzá tartozó műveletet. Kattintáskor egy `action` eseményt bocsát ki, amelyben átadja a művelet `key` értékét és a hozzá tartozó `payload` adatot.

A tényleges művelet végrehajtását a szülő komponens kezeli az eseményhez rendelt függvény segítségével.

```vue
<ActionButton
    :action="actionButtons[0]"
    :payload="appointment.id"
    @action="handleAction"
/>
```

```js
function handleAction({ key, payload })
{
    if (key === `approve`) approveAppointment(payload)
    if (key === `reject`) rejectAppointment(payload)
    if (key === `open`) openRepairSummary(payload)
}
```

**Fontos tudnivalók:**

- A `key` mező alapján a szülő komponens egyértelműen azonosítani tudja a kiválasztott műveletet.
- A `payload` segítségével bármilyen, a művelethez szükséges adat átadható a szülő komponensnek.
- A komponens nem tartalmazza a konkrét üzleti logikát, kizárólag a gomb megjelenítéséért és az esemény kibocsátásáért felel.
- A `borderColor` mező opcionális, csak akkor szükséges megadni, ha a gombnak keretet is szeretnénk.
- A `fontColor`, `backgroundColor` és `borderColor` mezők színtokenekkel és hagyományos CSS-színértékekkel is használhatók.
- A projekt színrendszerének egységessége érdekében lehetőség szerint a `colors.css`-ben definiált tokeneket használd.
- A komponens újrafelhasználhatóságának köszönhetően ugyanaz a gomb különböző oldalakon és különböző műveletekhez is alkalmazható.

Autószerviz-kezelő – Fejlesztői dokumentáció
Az autószerviz-kezelő alkalmazás a szerviz működéséhez kapcsolódó adatok és folyamatok kezelésére szolgáló webalkalmazás. A dokumentáció a projekt felépítését, a frontend komponenseit és azok használatát mutatja be, elsősorban a további fejlesztést segítve.

Újrafelhasználható komponensek
[StatusBadge.vue](fullstack/frontend/src/components/reusable/StatusBadge.vue)
A StatusBadge egy újrafelhasználható Vue komponens, amely különböző állapotok vizuális megjelenítésére szolgál (pl. „Függőben”, „Jóváhagyva”, „Lemondva”).

A komponens egyetlen status propot vár, amely egy JavaScript-objektumként tartalmazza a megjelenítéshez szükséges adatokat.

Használat:

Egyetlen állapot megjelenítése:

<StatusBadge :status="statusCodes[4]" />
Több állapot megjelenítése listából:

<StatusBadge
    v-for="statusCode in statusCodes"
    :key="statusCode.name"
    :status="statusCode"
/>
A status objektum felépítése:

{
    name: 'Lemondva',
    fontColor: 'danger',
    backgroundColor: 'danger-soft',
    displayBackground: true
}
Paraméter	Típus	Leírás
name	string	A megjelenítendő szöveg, vagyis az állapot neve.
fontColor	string	A szöveg színe. Megadható a colors.css egyik színtokenjének nevével vagy közvetlen CSS-színként (pl. #abc, rgb(...)).
backgroundColor	string	A háttér színe. Ugyanúgy színtoken neve vagy közvetlen CSS-szín adható meg.
displayBackground	boolean	Meghatározza, hogy megjelenjen-e a lekerekített háttér. true esetén megjelenik, false esetén csak a színes szöveg látható. Alapértelmezett értéke true.
Fontos tudnivalók:

A fontColor és backgroundColor mezők színtokenekkel és hagyományos CSS-színértékekkel is használhatók.
A projekt színrendszerének egységessége érdekében lehetőség szerint a colors.css-ben definiált tokeneket használd.
A displayBackground elhagyható, ilyenkor a komponens alapértelmezetten megjeleníti a hátteret.
A komponens használatakor mindig a teljes status objektumot add át a status propnak.
[ActionButton.vue](fullstack/frontend/src/components/reusable/ActionButton.vue)
Az ActionButton egy újrafelhasználható Vue komponens, amely különböző műveletek indítására szolgáló gombok megjelenítésére használható (pl. „Jóváhagy”, „Elutasít”, „Megnyit”).

A komponens egy action és egy payload propot vár. Az action egy JavaScript-objektumként tartalmazza a gomb megjelenítéséhez és azonosításához szükséges adatokat, míg a payload a művelet végrehajtásához szükséges kiegészítő adatokat (pl. egy foglalás azonosítóját) adja át.

Használat:

<ActionButton
    :action="actionButtons[0]"
    :payload="appointment.id"
    @action="handleAction"
/>
Az action objektum felépítése:

{
    key: 'approve',
    name: 'Jóváhagy',
    fontColor: 'accent-text',
    backgroundColor: 'accent',
    borderColor: 'danger'
}
Paraméter	Típus	Leírás
key	string	A művelet egyedi azonosítója. A szülő komponens ez alapján határozza meg, hogy milyen műveletet kell végrehajtani.
name	string	A gombon megjelenítendő szöveg.
fontColor	string	A szöveg színe. Megadható a colors.css egyik színtokenjének nevével vagy közvetlen CSS-színként (pl. #abc, rgb(...)).
backgroundColor	string	A gomb háttérszíne. Ugyanúgy színtoken neve vagy közvetlen CSS-szín adható meg. A transparent érték is használható.
borderColor	string	Opcionális keretszín. Ugyanúgy színtoken neve vagy közvetlen CSS-szín adható meg.
Eseménykezelés:

A komponens önállóan nem hajtja végre a hozzá tartozó műveletet. Kattintáskor egy action eseményt bocsát ki, amelyben átadja a művelet key értékét és a hozzá tartozó payload adatot.

A tényleges művelet végrehajtását a szülő komponens kezeli az eseményhez rendelt függvény segítségével.

<ActionButton
    :action="actionButtons[0]"
    :payload="appointment.id"
    @action="handleAction"
/>
function handleAction({ key, payload })
{
    if (key === `approve`) approveAppointment(payload)
    if (key === `reject`) rejectAppointment(payload)
    if (key === `open`) openRepairSummary(payload)
}
Fontos tudnivalók:

A key mező alapján a szülő komponens egyértelműen azonosítani tudja a kiválasztott műveletet.
A payload segítségével bármilyen, a művelethez szükséges adat átadható a szülő komponensnek.
A komponens nem tartalmazza a konkrét üzleti logikát, kizárólag a gomb megjelenítéséért és az esemény kibocsátásáért felel.
A borderColor mező opcionális, csak akkor szükséges megadni, ha a gombnak keretet is szeretnénk.
A fontColor, backgroundColor és borderColor mezők színtokenekkel és hagyományos CSS-színértékekkel is használhatók.
A projekt színrendszerének egységessége érdekében lehetőség szerint a colors.css-ben definiált tokeneket használd.
A komponens újrafelhasználhatóságának köszönhetően ugyanaz a gomb különböző oldalakon és különböző műveletekhez is alkalmazható.
[AppointmentSummaryCard.vue](fullstack/frontend/src/components/reusable/AppointmentSummaryCard.vue)
Az AppointmentSummaryCard egy újrafelhasználható Vue komponens, amely összefoglaló kártyák megjelenítésére szolgál. Elsősorban az adminisztrációs felületeken, például a Foglalások oldal tetején használható különböző statisztikai adatok és darabszámok megjelenítésére.

A kártya három fő elemből áll:

Címke (label): A megjelenített adat rövid megnevezése (pl. „Új, jóváhagyásra vár”).
Darabszám: A feltételnek megfelelő foglalások száma.
Leírás (description): A darabszámhoz kapcsolódó rövid tájékoztató szöveg.
A komponens alapértelmezetten maga számolja ki a megjelenítendő darabszámot az appointments tömb és a megadott filter alapján.

Használat:

<AppointmentSummaryCard
    label=`Új, jóváhagyásra vár`
    description=`Függő foglalás`
    :appointments=`appointments`
    :filter="{ status: 'Függőben' }"
/>
A komponens paraméterei:

Paraméter	Típus	Leírás
label	string	A kártya tetején megjelenő címke.
description	string	A darabszám alatt megjelenő tájékoztató szöveg.
appointments	array	A foglalásokat tartalmazó tömb, amelyből a komponens kiszámolja a darabszámot.
filter	object vagy function	Opcionális szűrési feltétel, amely meghatározza, hogy mely foglalásokat számolja bele a komponens.
count	number	Opcionális, előre kiszámított darabszám. Megadása esetén a komponens nem végez saját számítást.
A filter paraméter használata:

A szűrési feltétel kétféleképpen adható meg.

1. Objektum alapú szűrés

Az objektumban megadott mezőknek minden esetben egyezniük kell a foglalás megfelelő mezőivel.

<!-- Csak a függőben lévő foglalások -->
<AppointmentSummaryCard
    :filter="{ status: 'Függőben' }"
/>

<!-- Függőben lévő vagy jóváhagyott foglalások -->
<AppointmentSummaryCard
    :filter="{ status: ['Függőben', 'Jóváhagyva'] }"
/>
Tömb megadásakor elegendő, ha az adott mező értéke a tömb valamelyik elemével egyezik.

2. Függvény alapú szűrés

Összetettebb feltételek esetén JavaScript-függvény is megadható. A függvény minden foglalást külön megvizsgál, és a feltételnek megfelelő elemeket számolja bele az eredménybe.

<!-- Mai foglalások -->
<AppointmentSummaryCard
    :filter="(appointment) => appointment.appointmentDate.startsWith(today)"
/>
Előre megadott darabszám használata:

Amennyiben a darabszám már rendelkezésre áll (pl. az API válaszában), a count paraméter segítségével közvetlenül átadható a komponensnek.

<AppointmentSummaryCard
    label=`Új, jóváhagyásra vár`
    description=`Függő foglalás`
    :count=`pendingAppointmentsCount`
/>
Ilyenkor a komponens nem számolja meg az appointments tömb elemeit, hanem a megadott értéket jeleníti meg.

Fontos tudnivalók:

Ha nincs megadva filter, a komponens az appointments tömb összes elemét megszámolja.
Objektum alapú szűrésnél minden megadott mezőnek egyeznie kell.
Tömb érték megadásakor elegendő, ha az adott mező értéke a tömb valamelyik elemével egyezik.
Függvény alapú szűrés összetettebb feltételek megvalósítására alkalmas.
A count paraméter elsőbbséget élvez a saját számítással szemben.
A komponens újrafelhasználható különböző adatok és szűrési feltételek mellett, így nem kizárólag a foglalások oldalán alkalmazható.