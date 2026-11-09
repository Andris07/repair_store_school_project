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