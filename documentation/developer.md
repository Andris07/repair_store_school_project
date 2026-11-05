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
    :key="s.name"
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