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

### [AppointmentSummaryCard.vue](fullstack/frontend/src/components/reusable/AppointmentSummaryCard.vue)

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

## Navigációs és layout komponensek

### [navigation.mjs](frontend/src/utils/navigation.mjs)

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

### [SidebarContent.vue](frontend/src/components/layout/SidebarContent.vue)

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

### [BaseSidebar.vue](frontend/src/components/layout/BaseSidebar.vue)

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

### [BaseLayout.vue](frontend/src/layouts/BaseLayout.vue)

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
