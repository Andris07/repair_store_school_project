# Autószerviz-kezelő – Fejlesztői dokumentáció

Az autószerviz-kezelő alkalmazás a szerviz működéséhez kapcsolódó adatok és folyamatok kezelésére szolgáló webalkalmazás. A dokumentáció a projekt felépítését, a frontend komponenseit és azok használatát mutatja be, elsősorban a további fejlesztést segítve.

## Újrafelhasználható komponensek

### [StatusBadge.vue](../fullstack/frontend/src/components/reusable/StatusBadge.vue)

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

### [ActionButton.vue](../fullstack/frontend/src/components/reusable/ActionButton.vue)

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

### [AppointmentSummaryCard.vue](../fullstack/frontend/src/components/reusable/AppointmentSummaryCard.vue)

Az `AppointmentSummaryCard` egy újrafelhasználható Vue komponens, amely összefoglaló kártyák megjelenítésére szolgál. Elsősorban az adminisztrációs felületeken, például a Foglalások oldal tetején használható különböző statisztikai adatok és darabszámok megjelenítésére.

A kártya három fő elemből áll:
- **Címke (`label`):** A megjelenített adat rövid megnevezése (pl. „Új, jóváhagyásra vár”).
- **Darabszám:** A feltételnek megfelelő foglalások száma.
- **Leírás (`description`):** A darabszámhoz kapcsolódó rövid tájékoztató szöveg.

A komponens alapértelmezetten maga számolja ki a megjelenítendő darabszámot az `appointments` tömb és a megadott `filter` alapján.

**Használat:**

```vue
<AppointmentSummaryCard
    label=`Új, jóváhagyásra vár`
    description=`Függő foglalás`
    :appointments=`appointments`
    :filter="{ status: 'Függőben' }"
/>
```

**A komponens paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `label` | `string` | A kártya tetején megjelenő címke. |
| `description` | `string` | A darabszám alatt megjelenő tájékoztató szöveg. |
| `appointments` | `array` | A foglalásokat tartalmazó tömb, amelyből a komponens kiszámolja a darabszámot. |
| `filter` | `object` vagy `function` | Opcionális szűrési feltétel, amely meghatározza, hogy mely foglalásokat számolja bele a komponens. |
| `count` | `number` | Opcionális, előre kiszámított darabszám. Megadása esetén a komponens nem végez saját számítást. |

**A `filter` paraméter használata:**

A szűrési feltétel kétféleképpen adható meg.

**1. Objektum alapú szűrés**

Az objektumban megadott mezőknek minden esetben egyezniük kell a foglalás megfelelő mezőivel.

```vue
<!-- Csak a függőben lévő foglalások -->
<AppointmentSummaryCard
    :filter="{ status: 'Függőben' }"
/>

<!-- Függőben lévő vagy jóváhagyott foglalások -->
<AppointmentSummaryCard
    :filter="{ status: ['Függőben', 'Jóváhagyva'] }"
/>
```

Tömb megadásakor elegendő, ha az adott mező értéke a tömb valamelyik elemével egyezik.

**2. Függvény alapú szűrés**

Összetettebb feltételek esetén JavaScript-függvény is megadható. A függvény minden foglalást külön megvizsgál, és a feltételnek megfelelő elemeket számolja bele az eredménybe.

```vue
<!-- Mai foglalások -->
<AppointmentSummaryCard
    :filter="(appointment) => appointment.appointmentDate.startsWith(today)"
/>
```

**Előre megadott darabszám használata:**

Amennyiben a darabszám már rendelkezésre áll (pl. az API válaszában), a `count` paraméter segítségével közvetlenül átadható a komponensnek.

```vue
<AppointmentSummaryCard
    label=`Új, jóváhagyásra vár`
    description=`Függő foglalás`
    :count=`pendingAppointmentsCount`
/>
```

Ilyenkor a komponens nem számolja meg az `appointments` tömb elemeit, hanem a megadott értéket jeleníti meg.

**Fontos tudnivalók:**

- Ha nincs megadva `filter`, a komponens az `appointments` tömb összes elemét megszámolja.
- Objektum alapú szűrésnél minden megadott mezőnek egyeznie kell.
- Tömb érték megadásakor elegendő, ha az adott mező értéke a tömb valamelyik elemével egyezik.
- Függvény alapú szűrés összetettebb feltételek megvalósítására alkalmas.
- A `count` paraméter elsőbbséget élvez a saját számítással szemben.
- A komponens újrafelhasználható különböző adatok és szűrési feltételek mellett, így nem kizárólag a foglalások oldalán alkalmazható.

## Szolgáltatás-kezelő komponensek

### [ServiceCard.vue](../fullstack/frontend/src/components/services/ServiceCard.vue)

A `ServiceCard` egy újrafelhasználható Vue komponens, amely egy szolgáltatás adatait kártya formájában jeleníti meg. A kártyán a szolgáltatás neve, leírása, ára és – amennyiben rendelkezésre áll – időtartama látható. Elsősorban a szolgáltatások listázására és kiválasztott állapotának megjelenítésére használható.

**Használat:**

Alapértelmezett megjelenítés:

```vue
<ServiceCard :service="service" />
```

Kiválasztott állapot megjelenítése:

```vue
<ServiceCard :service="service" selected />
```

Tömörebb megjelenítés:

```vue
<ServiceCard :service="service" compact />
```

Műveleti gombok elhelyezése a kártya alján:

```vue
<ServiceCard :service="service">
    <template #actions>
        <button @click="editService(service)">Szerkeszt</button>
        <button @click="deleteService(service.id)">Töröl</button>
    </template>
</ServiceCard>
```

**A `service` objektum felépítése:**

```js
{
    id,
    name,
    description,
    price,
    duration_minutes?
}
```

| Mező | Leírás |
|---|---|
| `id` | A szolgáltatás egyedi azonosítója. |
| `name` | A szolgáltatás neve. |
| `description` | A szolgáltatás rövid leírása. Ha nincs megadva vagy üres, a leírás nem jelenik meg. |
| `price` | A szolgáltatás ára, formázott pénzösszegként megjelenítve. |
| `duration_minutes` | Opcionális időtartam percben. Ha nincs megadva, az időtartam nem jelenik meg. |

**A komponens paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `service` | `object` | Kötelező szolgáltatásobjektum, amely a kártyán megjelenő adatokat tartalmazza. |
| `selected` | `boolean` | Meghatározza, hogy a kártya kiválasztott állapotban jelenjen-e meg. Alapértelmezett értéke `false`. |
| `compact` | `boolean` | Tömörebb megjelenítést állít be: kisebb belső térközt és rövidebb, legfeljebb két soros leírást használ. Alapértelmezett értéke `false`. |

**Slot:**

A komponens egy névvel ellátott `actions` slotot biztosít. A slot tartalma a kártya alján, elválasztó vonal alatt jelenik meg, ezért például adminisztrációs felületen szerkesztési és törlési gombok helyezhetők el benne.

**Fontos tudnivalók:**

- A `service` paraméter kötelező, a kártya ebből az objektumból jeleníti meg az adatokat.
- A `duration_minutes` mező opcionális; hiányában a kártya nem jelenít meg időtartamot.
- A `selected` paraméter kizárólag a kiválasztott állapot vizuális jelzését szabályozza.
- A `compact` paraméter kisebb helyigényű megjelenítést biztosít, például szolgáltatásválasztó listában.
- Az `actions` slot tartalmának tényleges működését a kártyát használó szülő komponens kezeli.

### [ServiceSelect.vue](../fullstack/frontend/src/components/services/ServiceSelect.vue)

A `ServiceSelect` egy újrafelhasználható Vue komponens, amely szolgáltatások kiválasztását teszi lehetővé kártyák segítségével. Időpontfoglalás során használható, és egyszeres, illetve többszörös kiválasztási módot is támogat. A kiválasztott szolgáltatás vagy szolgáltatások azonosítóit a `v-model` segítségével adja vissza a szülő komponensnek.

Egyszeres módban rádiógombok, többszörös módban jelölőnégyzetek jelennek meg. A vezérlők billentyűzettel is kezelhetők.

**Használat:**

Egy szolgáltatás kiválasztása:

```vue
<ServiceSelect
    v-model="serviceId"
    :services="services"
/>
```

Több szolgáltatás kiválasztása:

```vue
<ServiceSelect
    v-model="serviceIds"
    :services="services"
    multiple
/>
```

Keresőmezővel és kiegészítő szöveggel:

```vue
<ServiceSelect
    v-model="serviceId"
    :services="services"
    searchable
    label="Válassz szolgáltatást"
    hint="Válaszd ki az elvégzendő munkát."
/>
```

**A `services` lista elemeinek felépítése:**

A lista minden eleme a `ServiceCard` által használt szolgáltatásobjektumot tartalmazza:

```js
{
    id,
    name,
    description,
    price,
    duration_minutes?
}
```

| Mező | Leírás |
|---|---|
| `id` | A szolgáltatás egyedi azonosítója; ezt az értéket adja vissza a `v-model`. |
| `name` | A szolgáltatás neve, amely a kártyán és a keresés során is felhasználásra kerül. |
| `description` | A szolgáltatás leírása, amely a keresés során szintén figyelembe vehető. |
| `price` | A szolgáltatás ára, amely többszörös kiválasztásnál az összesítésbe is beleszámít. |
| `duration_minutes` | Opcionális időtartam percben; többszörös kiválasztásnál az összesített időtartam része. |

**A komponens paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `services` | `array` | A megjeleníthető szolgáltatások listája. Alapértelmezett értéke üres tömb. |
| `multiple` | `boolean` | Bekapcsolásakor több szolgáltatás választható ki jelölőnégyzetekkel. Alapértelmezett értéke `false`. |
| `searchable` | `boolean` | Meghatározza, hogy megjelenjen-e a szolgáltatások szűrésére szolgáló keresőmező. Alapértelmezett értéke `false`. |
| `label` | `string` | A kiválasztó címe. Alapértelmezett értéke `Szolgáltatás`. |
| `hint` | `string` | A cím alatt megjelenő kiegészítő tájékoztató szöveg. |
| `error` | `string` | A kiválasztó alatt megjelenő hibaüzenet. |
| `disabled` | `boolean` | Letiltja a teljes kiválasztót és annak vezérlőit. Alapértelmezett értéke `false`. |
| `name` | `string` | A rádiógombok vagy jelölőnégyzetek csoportjának neve. Ha nincs megadva, a komponens egyedi nevet generál. |

**A `v-model` működése:**

A komponens a kiválasztott szolgáltatások azonosítóit adja vissza, nem a teljes szolgáltatásobjektumokat.

- Egyszeres módban a `v-model` egy szolgáltatás `id` értékét tartalmazza. Kezdeti alapértelmezett értéke `null`.
- Többszörös módban a `v-model` a kiválasztott `id` értékek tömbje. Ha kezdetben nem tömböt kap, a komponens üres tömbre állítja.

**Keresés:**

A `searchable` paraméter bekapcsolásakor a komponens keresőmezőt jelenít meg. A keresés a szolgáltatások nevében és leírásában történik, kis- és nagybetűtől függetlenül. Ha nincs egyező szolgáltatás, a komponens külön üzenetet jelenít meg. Hat vagy több szolgáltatás esetén érdemes bekapcsolni a keresést.

**Többszörös kiválasztás összesítése:**

Ha a `multiple` be van kapcsolva, és legalább egy szolgáltatás ki van választva, a komponens az alján összesítést jelenít meg. Ez tartalmazza a kiválasztott szolgáltatások darabszámát, összesített árát, valamint – ha van megadott időtartam – az összesített időtartamot is.

**Fontos tudnivalók:**

- A komponens a szolgáltatásokat a `ServiceCard` komponens segítségével, tömörített (`compact`) kártyaként jeleníti meg.
- Egyszeres módban rádiógombokkal, többszörös módban jelölőnégyzetekkel működik a kiválasztás.
- A `v-model` mindig azonosítókat tárol, ezért az aktuális szolgáltatás adatai a `services` listából kérhetők le.
- A `hint` szöveg csak akkor jelenik meg, ha nincs megadva `error`; hiba esetén a hibaüzenet látható.
- A `disabled` a teljes mezőcsoportot letiltja.
- Többszörös módban az ár és az időtartam az aktuálisan kiválasztott szolgáltatások alapján kerül összesítésre.

## Gépjármű-kezelő komponensek

### [VehicleSelect.vue](../fullstack/frontend/src/components/vehicles/VehicleSelect.vue)

A `VehicleSelect` egy újrafelhasználható Vue komponens, amely gépjárművek kiválasztására szolgál, például időpontfoglalás során. A rendelkezésre álló gépjárműveket rádiógombos kártyák formájában jeleníti meg, amelyek egérrel és billentyűzettel (nyilakkal) egyaránt kezelhetők.

A kiválasztott gépjármű azonosítóját a `v-model` segítségével adja vissza a szülő komponensnek.

**Használat:**

```vue
<VehicleSelect
    v-model="vehicleId"
    :vehicles="vehicles"
    :error="error"
    @add="openAddForm"
/>
```

**A komponens paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `vehicles` | `array` | A megjeleníthető gépjárművek listája. |
| `label` | `string` | A komponens címkéje. |
| `hint` | `string` | A kiválasztáshoz kapcsolódó kiegészítő információ. |
| `error` | `string` | Megjelenítendő hibaüzenet. |
| `disabled` | `boolean` | Meghatározza, hogy a komponens használható-e. |
| `name` | `string` | A rádiógombok neve. |
| `addable` | `boolean` | Meghatározza, hogy megjelenjen-e az „Új gépjármű” gomb. |

**A `v-model` működése:**

A komponens kétirányú adatkapcsolatot biztosít a szülő komponenssel:

- A kiválasztott gépjármű `id` értékét adja vissza.
- Ha nincs kiválasztott gépjármű, az érték `null`.

**Események:**

| Esemény | Leírás |
|---|---|
| `add` | Új gépjármű hozzáadásának kezdeményezése. |

**Fontos tudnivalók:**

- A komponens a kiválasztást rádiógombos kártyák segítségével valósítja meg.
- A kiválasztás billentyűzettel, a nyílbillentyűk használatával is kezelhető.
- A `v-model` nem a teljes gépjármű objektumot, hanem annak azonosítóját tárolja.
- Az új gépjármű hozzáadásához tartozó tényleges műveletet a szülő komponensnek kell kezelnie az `@add` eseményen keresztül.

### [VehicleList.vue](../fullstack/frontend/src/components/vehicles/VehicleList.vue)

A `VehicleList` egy újrafelhasználható Vue komponens, amely a felhasználó gépjárműveinek listázására szolgál. Kétféle megjelenítési módot támogat: görgethető listát és lapozható oldalakat.

A komponens igény szerint kiválasztási, szerkesztési és törlési lehetőségeket is biztosít.

**Használat:**

Görgethető lista:

```vue
<VehicleList
    :vehicles="vehicles"
    mode="scroll"
    height="22rem"
    @select="handleSelect"
/>
```

Lapozható lista:

```vue
<VehicleList
    :vehicles="vehicles"
    mode="pages"
    :page-size="2"
/>
```

**Megjelenítési módok:**

| Mód | Leírás |
|---|---|
| `scroll` | Fix magasságú lista, amelynek tartalma belső görgetéssel tekinthető meg. A magasságot a `height` paraméter határozza meg. |
| `pages` | Lapozható lista, amely egyszerre meghatározott számú gépjárművet jelenít meg. A lapméretet a `pageSize` paraméter határozza meg. |

A `pageSize` alapértelmezett értéke `2`.

**A gépjármű objektum felépítése:**

```js
{
    id,
    plate,
    make,
    model,
    year,
    note?
}
```

| Mező | Leírás |
|---|---|
| `id` | A gépjármű egyedi azonosítója. |
| `plate` | A gépjármű rendszáma. |
| `make` | A gépjármű gyártója. |
| `model` | A gépjármű modellje. |
| `year` | A gépjármű gyártási éve. |
| `note` | Opcionális megjegyzés. |

**A komponens paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `vehicles` | `array` | A megjelenítendő gépjárművek listája. |
| `mode` | `string` | A megjelenítési mód (`scroll` vagy `pages`). |
| `pageSize` | `number` | Egy oldalon megjelenített gépjárművek száma. Alapértelmezés: `2`. |
| `height` | `string` | A görgethető lista magassága. |
| `selectedId` | `number` vagy `string` | A kiválasztott gépjármű azonosítója. |
| `title` | `string` | A lista címe. |
| `emptyText` | `string` | A lista üres állapotában megjelenő szöveg. |
| `selectable` | `boolean` | Meghatározza, hogy megjelenjen-e a kiválasztási lehetőség. |
| `editable` | `boolean` | Meghatározza, hogy megjelenjen-e a szerkesztési lehetőség. |
| `removable` | `boolean` | Meghatározza, hogy megjelenjen-e a törlési lehetőség. |

**Események:**

A komponens három eseményt bocsáthat ki:

| Esemény | Leírás |
|---|---|
| `select` | Gépjármű kiválasztása. A teljes gépjármű objektumot adja át. |
| `edit` | Gépjármű szerkesztésének kezdeményezése. A teljes gépjármű objektumot adja át. |
| `remove` | Gépjármű törlésének kezdeményezése. A teljes gépjármű objektumot adja át. |

**Fontos tudnivalók:**

- A `mode` paraméter határozza meg a lista megjelenítési módját.
- `scroll` módban a lista magasságát a `height` paraméter szabályozza.
- `pages` módban a `pageSize` határozza meg az egy oldalon megjelenő elemek számát.
- A `selectable`, `editable` és `removable` paraméterekkel külön-külön szabályozható a megfelelő műveleti lehetőségek megjelenítése.
- A kiválasztás, szerkesztés és törlés tényleges végrehajtását a szülő komponensnek kell kezelnie az eseményeken keresztül.

## Foglalási komponensek

### [AppointmentSlotPicker.vue](../fullstack/frontend/src/components/booking/AppointmentSlotPicker.vue)

Az `AppointmentSlotPicker` egy újrafelhasználható Vue komponens, amely dátum- és időpontválasztást biztosít időpontfoglalás során. Egy naptárat és a kiválasztott naphoz tartozó elérhető idősávokat jeleníti meg.

A komponens figyelembe veszi a nyitvatartási napokat és időszakokat, a zárva tartó napokat, valamint a már lefoglalt időpontokat.

**Használat:**

```vue
<AppointmentSlotPicker
    v-model="slot"
    :booked="['2026-11-16T09:00']"
/>
```

**A `v-model` működése:**

A kiválasztott időpontot szöveges formában adja vissza:

`YYYY-MM-DDTHH:mm`

Például:

```js
"2026-11-16T09:30"
```

Ha még nincs kiválasztott időpont, az érték üres szöveg (`''`).

**A komponens paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `booked` | `array` | A már lefoglalt idősávok tömbje. Formátum: `YYYY-MM-DDTHH:mm`. |
| `closedDates` | `array` | A zárva tartó napok tömbje, például ünnepnapok. Formátum: `YYYY-MM-DD`. |
| `openDays` | `array` | A nyitvatartási napokat meghatározó tömb. A hét napjai `0` (hétfő) és `6` (vasárnap) között adhatók meg. Alapértelmezés: hétfőtől péntekig. |
| `open` | `string` | A napi nyitvatartás kezdete (`HH:mm`). Alapértelmezés: `08:00`. |
| `close` | `string` | A napi nyitvatartás vége (`HH:mm`). Alapértelmezés: `17:00`. |
| `slotMinutes` | `number` | Egy idősáv hossza percben. Alapértelmezés: `30`. |
| `breakStart` | `string` | Az ebédszünet kezdete (`HH:mm`). |
| `breakEnd` | `string` | Az ebédszünet vége (`HH:mm`). |
| `maxDate` | `string` | A legkésőbbi foglalható dátum (`YYYY-MM-DD`). Alapértelmezés: nincs korlátozás. |
| `label` | `string` | A komponens címkéje. |
| `hint` | `string` | A dátum- és időpontválasztáshoz kapcsolódó kiegészítő információ. |
| `error` | `string` | Megjelenítendő hibaüzenet. |
| `disabled` | `boolean` | Meghatározza, hogy a komponens használható-e. |

**A dátum- és időpontválasztás működése:**

A komponens a megadott nyitvatartási feltételek alapján határozza meg, hogy mely dátumok és idősávok választhatók.

- Csak a `openDays` paraméterben meghatározott munkanapok választhatók.
- A `closedDates` paraméterben megadott napok nem választhatók.
- A múltbeli dátumok és időpontok le vannak tiltva.
- A `booked` tömbben szereplő idősávok nem választhatók.
- A nyitvatartási időn kívüli időpontok nem érhetők el.
- A `breakStart` és `breakEnd` paraméterekkel meghatározott ebédszünet idejére nem lehet időpontot foglalni.
- A `maxDate` paraméterrel korlátozható a legkésőbbi foglalható dátum.

**Fontos tudnivalók:**

- A `booked` tömb elemeinek `YYYY-MM-DDTHH:mm` formátumú időpontokat kell tartalmazniuk.
- A `closedDates` tömb elemeinek `YYYY-MM-DD` formátumú dátumokat kell tartalmazniuk.
- A hét napjainak számozása `0` értéktől (hétfő) `6` értékig (vasárnap) történik.
- Az idősávok hosszát a `slotMinutes` paraméter határozza meg.
- A nyitvatartás és az ebédszünet időtartama a megfelelő paraméterekkel módosítható.
- A `maxDate` elhagyásával nem kerül meghatározásra külön legkésőbbi foglalási dátum.
- A komponens a kiválasztott időpontot a `v-model` segítségével továbbítja a szülő komponensnek.

## Javítás-kezelő komponensek

### [CurrentRepair.vue](../fullstack/frontend/src/components/repairs/CurrentRepair.vue)

A `CurrentRepair` egy újrafelhasználható Vue komponens, amely egy foglaláshoz tartozó aktuális javítás állapotának és legfontosabb adatainak összefoglaló megjelenítésére szolgál.

A komponens egyetlen foglaláshoz kapcsolódóan jeleníti meg a gépjármű adatait, az igénybe vett szolgáltatásokat, a javítás aktuális állapotát, valamint a javításhoz kapcsolódó eseményeket és frissítéseket.

**Használat:**

```vue
<CurrentRepair :appointment="appointment" />
```

Műveleti gombok elhelyezése a kártya alján:

```vue
<CurrentRepair :appointment="appointment">
    <template #actions>
        <button @click="cancelAppointment(appointment.id)">
            Lemondás
        </button>
    </template>
</CurrentRepair>
```

**A `appointment` objektum felépítése:**

```js
{
    id,
    status,
    date,
    vehicle: {
        plate,
        make,
        model,
        year?
    },
    services: [
        { name }
    ],
    worker?,
    note?,
    estimatedDone?,
    updates?: [
        {
            at,
            text
        }
    ]
}
```

| Mező | Leírás |
|---|---|
| `id` | A foglalás egyedi azonosítója. |
| `status` | A javítás aktuális állapota. |
| `date` | A foglaláshoz tartozó dátum. |
| `vehicle` | A javításhoz tartozó gépjármű adatai. |
| `vehicle.plate` | A gépjármű rendszáma. |
| `vehicle.make` | A gépjármű gyártója. |
| `vehicle.model` | A gépjármű modellje. |
| `vehicle.year` | Opcionális gyártási év. |
| `services` | A foglaláshoz tartozó szolgáltatások listája. |
| `services[].name` | Az adott szolgáltatás neve. |
| `worker` | Opcionális, a javításért felelős munkatárs neve. |
| `note` | Opcionális megjegyzés a javításhoz. |
| `estimatedDone` | Opcionális, a javítás várható befejezési dátuma (`YYYY-MM-DD`). |
| `updates` | Opcionális eseménylista, amely a javítás során történt változásokat tartalmazza. |
| `updates[].at` | Az esemény időpontja (`YYYY-MM-DDTHH:mm`). |
| `updates[].text` | Az eseményhez tartozó leírás. |

**A `status` mező lehetséges értékei:**

| Érték | Jelentés |
|---|---|
| `pending` | Függőben lévő foglalás. |
| `approved` | Jóváhagyott foglalás. |
| `progress` | Folyamatban lévő javítás. |
| `done` | Befejezett javítás. |
| `rejected` | Elutasított foglalás. |

Az állapotokhoz tartozó megnevezések és egyéb megjelenítési beállítások az `@utils/statuses.mjs` fájlban találhatók.

**A komponens paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `appointment` | `object` | A megjelenítendő foglalás és a hozzá tartozó javítás adatai. |
| `title` | `string` | A kártya címe. |

**Slot:**

A komponens egy névvel ellátott `actions` slotot biztosít. A slot tartalma a kártya alján jelenik meg, így például lemondási vagy egyéb műveleti gombok helyezhetők el benne.

A slot tartalmának tényleges működését a komponenst használó szülő komponens kezeli.

**Fontos tudnivalók:**

- Az `appointment` objektum tartalmazza a javítás megjelenítéséhez szükséges adatokat.
- A `vehicle` objektum a javításhoz tartozó gépjármű legfontosabb adatait tartalmazza.
- A `services` tömb a foglaláshoz kapcsolódó szolgáltatásokat sorolja fel.
- A `status` mező értékének az `@utils/statuses.mjs` fájlban meghatározott állapotok egyikének kell lennie.
- A `worker`, `note`, `estimatedDone` és `updates` mezők opcionálisak.
- Az eseménylista időpontjai `YYYY-MM-DDTHH:mm` formátumú szövegként adhatók meg.
- Az `actions` slot lehetővé teszi, hogy a komponens különböző oldalakon eltérő műveleti gombokkal legyen kiegészíthető.
- A komponens a megjelenítésért felel, a foglaláshoz kapcsolódó tényleges műveleteket a szülő komponensnek kell kezelnie.

## Navigációs és layout komponensek

### [navigation.mjs](../fullstack/frontend/src/utils/navigation.mjs)

A `navigation.mjs` egy központi konfigurációs fájl, amely a felhasználói szerepkörökhöz tartozó navigációs menüpontokat és azok megjelenítéséhez szükséges adatokat tárolja. Emellett a szerepkörök azonosítóit és azok felhasználóbarát magyar megnevezéseit is exportálja.

A fájl három fő értéket exportál:

- `ROLES`: a támogatott szerepkörök azonosítóit tartalmazó tömb (`customer`, `admin`, `worker`).
- `roleLabels`: a szerepkörök azonosítójához tartozó megjelenítendő megnevezéseket tartalmazó objektum.
- `navigation`: szerepkörönként csoportosítva tartalmazza a navigációs menüpontokat.

**A `navigation` objektum felépítése:**

```js
export const navigation = {
  customer: [
    { label: `Áttekintő`, to: `/`, icon: LayoutDashboard },
    { label: `Gépjárműveim`, to: `/vehicles`, icon: Car }
  ],
  admin: [
    { label: `Dashboard`, to: `/admin`, icon: LayoutDashboard }
  ],
  worker: [
    { label: `Munkáim`, to: `/worker/jobs`, icon: ListChecks }
  ]
}
```

**Egy navigációs elem paraméterei:**

| Paraméter | Típus | Leírás |
|---|---|---|
| `label` | `string` | A menüpont mellett megjelenő szöveg. |
| `to` | `string` | A menüponthoz tartozó útvonal, amelyre kattintáskor navigál az alkalmazás. |
| `icon` | komponens | A menüpont mellett megjelenő, `@lucide/vue` csomagból származó ikonkomponens. |

**Fontos tudnivalók:**

- A navigációs menüpontokat szerepkör szerint kell megadni. A `customer`, `admin` és `worker` kulcsok határozzák meg, hogy melyik felhasználó milyen menüpontokat lát.
- A `roleLabels` objektum a szerepkör rövid, felületen megjelenő magyar nevét biztosítja.
- Új menüpont hozzáadásakor a megfelelő szerepkör tömbjét kell bővíteni.
- A menüpontok útvonalait és ikonjait ez a fájl központilag kezeli, így a navigációs felület komponenseinek nem kell külön definiálniuk ezeket az adatokat.

### [SidebarContent.vue](../fullstack/frontend/src/components/layout/SidebarContent.vue)

A `SidebarContent` a navigációs oldalsáv tartalmát megjelenítő Vue komponens. Megjeleníti az alkalmazás nevét és kezdőbetűjét, az aktuális felhasználói szerepkör megnevezését, a szerepkörhöz tartozó navigációs menüpontokat, valamint a felhasználó nevét és a kijelentkezési lehetőséget.

A navigációs elemeket a `navigation.mjs` fájlból tölti be, ezért a megjelenített menüpontok automatikusan az átadott szerepkörhöz igazodnak.

**Használat:**

```vue
<SidebarContent
  :role="role"
  :user-name="userName"
  @navigate="handleNavigate"
  @logout="handleLogout"
/>
```

**A komponens paraméterei:**

| Paraméter | Típus | Alapértelmezett érték | Leírás |
|---|---|---|---|
| `role` | `string` | `customer` | Meghatározza, hogy melyik szerepkör navigációs menüpontjai jelenjenek meg. A megengedett értékeket a `navigation` objektum kulcsai adják. |
| `userName` | `string` | üres szöveg | A navigációs sáv alján megjelenő felhasználónév. |

**Eseménykezelés:**

A komponens két eseményt bocsát ki:

| Esemény | Mikor aktiválódik? | Leírás |
|---|---|---|
| `navigate` | Az alkalmazás nevére vagy egy navigációs menüpontra kattintáskor. | Jelzi a szülő komponensnek, hogy navigáció történt. |
| `logout` | A „Kijelentkezés” gombra kattintáskor. | Jelzi a szülő komponensnek, hogy a felhasználó ki szeretne jelentkezni. |

**Működés:**

- A `links` számított érték az átadott `role` alapján választja ki a `navigation` objektum megfelelő menüpontjait.
- A menüpontok `RouterLink` elemekkel jelennek meg. Az aktuális útvonalhoz tartozó elem eltérő megjelenítést kap.
- Az ikonokat a navigációs konfigurációban megadott komponensek biztosítják.
- Az alkalmazás neve a `VITE_APP_NAME` környezeti változóból származik. A megjelenített kezdőbetűt a komponens ebből számítja ki.
- A komponens a navigációs eseményt továbbítja, de a tényleges kijelentkeztetési műveletet a szülő komponensnek kell kezelnie.

**Fontos tudnivalók:**

- A `role` értékének a `navigation.mjs` fájlban definiált szerepkörök egyikének kell lennie.
- A `userName` elhagyható, ilyenkor a felhasználónév helye üres marad.
- A komponens nem kezeli önállóan a kijelentkezést; ehhez a szülő komponensnek kell megadnia az `@logout` eseménykezelőt.
- A `navigate` esemény mobilnézetben az oldalsáv bezárására is felhasználható.

### [BaseSidebar.vue](../fullstack/frontend/src/components/layout/BaseSidebar.vue)

A `BaseSidebar` a navigációs oldalsáv külső, reszponzív keretét biztosító Vue komponens. Mobilnézetben felső fejlécet és abból megnyitható, bal oldalról behúzható menüt jelenít meg, nagyobb képernyőn pedig fix szélességű, bal oldali oldalsávként működik.

A menü tényleges tartalmának megjelenítését a `SidebarContent` komponens végzi, így a navigációs tartalom mobil- és asztali nézetben is ugyanazt a komponenst használja.

**Használat:**

```vue
<BaseSidebar
  :role="role"
  :user-name="userName"
  @logout="handleLogout"
/>
```

**A komponens paraméterei:**

| Paraméter | Típus | Alapértelmezett érték | Leírás |
|---|---|---|---|
| `role` | `string` | `customer` | Továbbadja a `SidebarContent` komponensnek az aktuális felhasználói szerepkört. |
| `userName` | `string` | üres szöveg | Továbbadja a `SidebarContent` komponensnek a megjelenítendő felhasználónevet. |

**Eseménykezelés:**

A komponens egy `logout` eseményt bocsát ki. A `SidebarContent` által kibocsátott kijelentkezési eseményt továbbítja a saját szülő komponense felé.

```vue
<BaseSidebar
  :role="role"
  :user-name="userName"
  @logout="handleLogout"
/>
```

**Működés:**

- Mobilnézetben a fejlécben található menügomb nyitja meg a `Sheet` felületet.
- A mobilmenü nyitott állapotát a `mobileOpen` reaktív változó kezeli.
- A mobilmenüben a navigáció után a `SidebarContent` által kibocsátott `navigate` esemény bezárja a menüt.
- Asztali nézetben a komponens egy bal oldali, teljes képernyőmagasságú oldalsávot jelenít meg.
- Mindkét nézet a `SidebarContent` komponenst használja, és ugyanazokat a `role` és `userName` adatokat kapja.
- A fejlécben megjelenő alkalmazásnév a `VITE_APP_NAME` környezeti változóból származik.

**Fontos tudnivalók:**

- A mobil- és asztali nézet megjelenítését a Tailwind CSS reszponzív osztályai szabályozzák.
- A mobilmenü a `Sheet` komponensre épül.
- A `role` és a `userName` paramétereket a komponens továbbadja a belső `SidebarContent` komponensnek.
- A kijelentkezési logikát nem a `BaseSidebar` hajtja végre; a műveletet a szülő komponensnek kell kezelnie az `@logout` eseményen keresztül.

### [BaseLayout.vue](../fullstack/frontend/src/layouts/BaseLayout.vue)

A `BaseLayout` az alkalmazás oldalainak közös elrendezését biztosító Vue komponens. Egységes szerkezetbe rendezi a navigációs oldalsávot és az oldal aktuális tartalmát. A navigáció megjelenítéséhez a `BaseSidebar` komponenst használja, az oldalanként eltérő tartalmat pedig a Vue `slot` mechanizmusán keresztül fogadja.

**Használat:**

```vue
<BaseLayout
  :role="role"
  :user-name="userName"
  @logout="handleLogout"
>
  <RouterView />
</BaseLayout>
```

**A komponens paraméterei:**

| Paraméter | Típus | Alapértelmezett érték | Leírás |
|---|---|---|---|
| `role` | `string` | `customer` | Meghatározza az oldalsávban megjelenő navigációs menüpontokhoz tartozó felhasználói szerepkört. |
| `userName` | `string` | `Kiss Péter` | Az oldalsávban megjelenő felhasználónév. |

**Eseménykezelés:**

A komponens egy `logout` eseményt bocsát ki. A `BaseSidebar` által továbbított kijelentkezési eseményt a `BaseLayout` továbbadja a saját szülő komponensének.

**A tartalom elhelyezése:**

A `BaseLayout` a Vue `slot` elemével jeleníti meg a használatakor közrefogott tartalmat. Így az egyes oldalaknak nem kell külön megvalósítaniuk az oldalsávot és az alapvető oldalelrendezést.

```vue
<BaseLayout :role="role" :user-name="userName" @logout="handleLogout">
  <h1>Oldal címe</h1>
  <p>Az oldal saját tartalma.</p>
</BaseLayout>
```

**Működés:**

- A külső konténer legalább a teljes képernyőmagasságot kitölti.
- Kisebb képernyőn az elrendezés oszlopos, nagyobb képernyőn (`lg` törésponttól) soros: az oldalsáv balra, az oldal tartalma mellette jelenik meg.
- A `BaseSidebar` a `role` és a `userName` értékeket kapja meg, a kijelentkezési eseményt pedig továbbítja.
- A `main` elemben jelenik meg az aktuális oldal sloton keresztül átadott tartalma.

**Fontos tudnivalók:**

- A `BaseLayout` az oldalak közös keretét biztosítja, nem tartalmazza az egyes oldalak konkrét tartalmát.
- A `role` és a `userName` paraméterekkel szabályozható az oldalsáv tartalma.
- A kijelentkezés tényleges végrehajtását a `BaseLayout` szülő komponensének kell megvalósítania.
- Az oldalak saját tartalmát a komponens nyitó és záró tagje közé kell elhelyezni.

## Autentikációs komponensek

### [AuthLayout.vue](../fullstack/frontend/src/layouts/AuthLayout.vue)

Az autentikációs oldalak (bejelentkezés és regisztráció) közös, kétoszlopos elrendezését biztosítja.

- **Bal oldali panel:** Márkaelemeket és a weboldal arculatát jeleníti meg.
- **Jobb oldali panel:** A tényleges autentikációs tartalmat jeleníti meg a `slot` segítségével.
- **Reszponzivitás:** 1280 px alatti képernyőszélességnél a bal oldali márkapanel eltűnik, és a logó a kártya fölött jelenik meg.
- **Téma:** A jobb felső sarokban található gombbal váltható a világos és sötét megjelenés.

### [AuthCard.vue](../fullstack/frontend/src/components/auth/AuthCard.vue)

Az autentikációs oldalak központi kártyakomponense. Kezeli a bejelentkezési és regisztrációs űrlap közötti váltást, valamint megjeleníti az aktuális űrlapot és az ahhoz tartozó visszajelzéseket.

**Főbb funkciók:**
- Bejelentkezési és regisztrációs fülek.
- Az aktuális módnak megfelelő cím és űrlap megjelenítése.
- Betöltési állapot, hibaüzenet és értesítés megjelenítése.
- Az űrlap alatti kiegészítő tartalom megjelenítése.

A fülek valódi `/login` és `/register` útvonalakra mutató linkek. Az URL mindig követi az aktuális űrlapot, így a böngésző vissza gombja is megfelelően működik.

**Használat:**
```vue
<AuthCard
  mode="login"
  :loading="loading"
  :error="error"
  @login="handleLogin"
/>
```

Regisztráció esetén a `mode="register"` és az `@register` esemény használható.

**Props:**
| Prop | Típus | Leírás |
|---|---|---|
| `mode` | `login \| register` | Meghatározza, melyik űrlap jelenjen meg. |
| `loading` | `Boolean` | Betöltési állapot. |
| `error` | `String` | Megjelenítendő hibaüzenet. |
| `notice` | `String` | Megjelenítendő értesítés. |

**Események:**
| Esemény | Leírás |
|---|---|
| `login` | Bejelentkezési adatok továbbítása. |
| `register` | Regisztrációs adatok továbbítása. |
| `forgot-password` | Elfelejtett jelszó folyamat indítása. |

### [LoginForm.vue](../fullstack/frontend/src/components/auth/LoginForm.vue)

A bejelentkezési űrlap mezőit és azok kezelését biztosítja.

**Mezők:**
- E-mail-cím
- Jelszó
- Emlékezz rám jelölőnégyzet

A komponens önállóan nem kommunikál a backenddel. Sikeres validáció után `submit` eseményt bocsát ki a megadott adatokkal.

**Kibocsátott adatok:**
```js
{
  email,
  password,
  remember
}
```

**Props:**
| Prop | Típus | Leírás |
|---|---|---|
| `loading` | `Boolean` | Betöltési állapot. |
| `error` | `String` | Megjelenítendő hibaüzenet. |

**Események:**
- `submit`: A bejelentkezési adatok továbbítása.
- `forgot-password`: Elfelejtett jelszó folyamat indítása.

A tényleges bejelentkezést a szülőoldal (például `login.vue`) végzi az `utils/auth.mjs` segítségével.

### [RegisterForm.vue](../fullstack/frontend/src/components/auth/RegisterForm.vue)

A regisztrációs űrlap mezőit és azok kezelését biztosítja.

**Mezők:**
- Név
- E-mail-cím
- Telefonszám
- Jelszó
- Jelszó megerősítése

A komponens nem kommunikál közvetlenül a backenddel. Sikeres validáció után `submit` eseményt bocsát ki.

**Kibocsátott adatok:**
```js
{
  name,
  email,
  phone,
  password
}
```

A jelszó megerősítése nem kerül továbbításra. Ha a telefonszám mező üres, értéke `null`.

A felhasználói szerepkört a backend állítja be, ezért azt a frontend nem küldi el.

**Props:**
| Prop | Típus | Leírás |
|---|---|---|
| `loading` | `Boolean` | Betöltési állapot. |
| `error` | `String` | Megjelenítendő hibaüzenet. |

**Események:**
- `submit`: A regisztrációs adatok továbbítása.

A tényleges regisztrációt a szülőoldal (például `register.vue`) végzi az `utils/auth.mjs` segítségével.

### [FormField.vue](../fullstack/frontend/src/components/reusable/FormField.vue)

Újrafelhasználható űrlapmező-komponens, amely egységes megjelenést biztosít a címkével, beviteli mezővel, súgóval és hibaüzenettel együtt.

**Főbb funkciók:**
- Címke és beviteli mező összekapcsolása.
- Súgó- és hibaüzenetek megjelenítése.
- Jelszó típusú mezőknél a jelszó láthatóságának kapcsolása.
- Akadálymentesség: a címke, súgó és hibaüzenet egyedi azonosítókkal kapcsolódik a mezőhöz a `useId` segítségével.

**Használat:**
```vue
<FormField
  v-model="email"
  label="E-mail-cím"
  type="email"
  placeholder="pelda@email.com"
  :error="errors.email"
/>
```

A validációt nem maga a komponens végzi. A hibaüzenetet a szülőkomponens adja át.

### [validators.mjs](../fullstack/frontend/src/utils/validators.mjs)

Vue-től független, egyszerű JavaScript validációs segédfüggvényeket tartalmaz. A validációs logika így külön is tesztelhető és más komponensekben is újrafelhasználható.

**Szabályok felépítése:**

Minden validációs szabály egy függvény, amely megkapja az ellenőrizendő értéket és az űrlap összes aktuális értékét:

```js
(value, allFormValues) => true | 'Hibaüzenet'
```

- `true`: az érték megfelel a szabálynak.
- Szöveg: a megjelenítendő hibaüzenet.

**A `validate(values, schema)` függvény:**

Az űrlap értékeit a megadott sémával ellenőrzi, majd hibaobjektumot ad vissza.

```js
{
  email: 'Érvénytelen e-mail-cím.',
  password: 'A jelszó túl rövid.'
}
```

Ha nincs hiba, üres objektumot (`{}`) ad vissza.

A szabályok felépítése kompatibilis lehet például a `vee-validate` validációs szabályaival is.

### [auth.mjs](../fullstack/frontend/src/utils/auth.mjs)

Az autentikációs műveletekhez tartozó API-hívások helye. A bejelentkezési és regisztrációs oldalak ezt a modult használják a backenddel való kommunikációhoz.

Jelenleg a függvények előkészített helyőrzők, a tényleges backend-integráció itt valósítható meg.

**Működés:**
- Sikeres kérés esetén a függvény visszaadja a backend válaszát.
- Sikertelen kérés esetén egy érthető magyar hibaüzenetet tartalmazó `Error` objektumot dob.
- A hibát a szülőoldal kezeli, majd továbbadja az űrlapnak megjelenítésre.

**Példa Axios használatára:**
```js
import { api } from '@utils/http.mjs'

export async function login({ email, password, remember }) {
  try {
    const { data } = await api.post('/login', { email, password })

    // TODO: felhasználó/token tárolása (pl. Pinia segítségével)
    return data
  } catch (error) {
    throw new Error(
      error.response?.data?.message ?? 'Sikertelen bejelentkezés.'
    )
  }
}
```

**Jelszókezelés:**
- A frontend a jelszót kizárólag HTTPS-kérés törzsében továbbítja.
- A jelszó tárolását és hash-elését a backend végzi.
- A frontend nem tárolja el a jelszót.
- A backend által tárolt jelszó hash-elt formában (`passwordHash`) szerepel.