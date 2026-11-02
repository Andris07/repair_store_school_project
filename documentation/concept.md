# Autószerviz-kezelő – Projektterv

## Tartalomjegyzék

1. [Projekt áttekintése](#1-projekt-áttekintése)
2. [Konkrét célok](#2-konkrét-célok)
3. [Felhasználói szerepkörök](#3-felhasználói-szerepkörök)
4. [Oldalak felépítése](#4-oldalak-felépítése)
5. [Drótváz- és dizájnelvek](#5-drótváz--és-dizájnelvek)
6. [Adatbázis-tervezet](#6-adatbázis-tervezet)
7. [Technológiák](#7-technológiák)
8. [Célcsoport és a projekt előnyei](#8-célcsoport-és-a-projekt-előnyei)
9. [Összegzés](#9-összegzés)

---

## 1. Projekt áttekintése

### Miről szól az Autószerviz-kezelő?

Az **Autószerviz-kezelő** egy reszponzív, böngészőből használható webalkalmazás, amely egy autószerviz alapvető működését támogatja.

Az ügyfelek regisztrálhatnak, rögzíthetik saját gépjárműveiket, időpontot foglalhatnak, és megtekinthetik a javításuk aktuális állapotát. A szerviz dolgozói kezelhetik a hozzájuk rendelt munkákat, az adminisztrátor pedig felügyelheti a foglalásokat, a felhasználókat és a dolgozókat.

### Főbb funkciók

| Funkció | Leírás |
|---|---|
| **Regisztráció és bejelentkezés** | Ügyfélfiók létrehozása és biztonságos bejelentkezés. |
| **Gépjárművek kezelése** | Az ügyfelek hozzáadhatják és szerkeszthetik saját autóik adatait. |
| **Szolgáltatások megtekintése** | A szerviz által kínált szolgáltatások és azok leírásának megjelenítése. |
| **Időpontfoglalás** | Az ügyfél kiválaszthatja a gépjárművet, a szolgáltatást és a kívánt időpontot. |
| **Foglalások kezelése** | Az ügyfél megtekintheti saját foglalásait, az adminisztrátor pedig jóváhagyhatja vagy elutasíthatja azokat. |
| **Javítások kezelése** | A dolgozó megtekintheti a hozzá rendelt javításokat, és módosíthatja azok állapotát. |
| **Adminisztráció** | A felhasználók, dolgozók, szolgáltatások és foglalások kezelése. |

A javítások állapota például a következő lehet: **Függőben, Jóváhagyva, Folyamatban, Elkészült, Lemondva.**

---

## 2. Konkrét célok

A projekt végére az alábbi funkciókat szeretnénk megvalósítani:

- [ ] Reszponzív, többoldalas weboldal elkészítése.
- [ ] Regisztráció, bejelentkezés és kijelentkezés.
- [ ] Jelszavak hash-alapú tárolása.
- [ ] Három jogosultsági szint kialakítása: ügyfél, dolgozó és adminisztrátor.
- [ ] Gépjárművek hozzáadása és kezelése.
- [ ] Szervizszolgáltatások megjelenítése.
- [ ] Időpontfoglalás létrehozása és kezelése.
- [ ] Foglalások adminisztrátori jóváhagyása.
- [ ] Javítások dolgozókhoz rendelése.
- [ ] Javítási állapotok módosítása és megjelenítése.
- [ ] JSON-alapú kommunikáció a frontend és a backend között.
- [ ] Az adatok tárolása összekapcsolt adatbázisban.

---

## 3. Felhasználói szerepkörök

A rendszer három különböző szerepkört különböztet meg.

| Szerepkör | Jogosultságok |
|---|---|
| **Ügyfél (User)** | Regisztráció, bejelentkezés, saját gépjárművek kezelése, időpontfoglalás és saját javítások állapotának megtekintése. |
| **Dolgozó (Employee)** | Hozzárendelt javítások megtekintése, javítási állapot módosítása és megjegyzések hozzáadása. |
| **Adminisztrátor (Admin)** | Felhasználók és dolgozók kezelése, foglalások jóváhagyása, javítások dolgozókhoz rendelése, szolgáltatások kezelése. |

A jogosultságokat a backendnek is ellenőriznie kell, nem elegendő csak a frontend menüpontjait elrejteni.

---

## 4. Oldalak felépítése

### Publikus oldalak

| Oldal | Tartalom |
|---|---|
| **Főoldal** | A szerviz rövid bemutatása és a főbb szolgáltatások. |
| **Szolgáltatások** | Elérhető javítások és karbantartási szolgáltatások. |
| **Bejelentkezés / Regisztráció** | Felhasználói fiók kezelése. |

### Ügyfélfelület

- **Áttekintő:** aktuális foglalások és javítások.
- **Gépjárműveim:** saját autók hozzáadása és szerkesztése.
- **Időpontfoglalás:** szolgáltatás, gépjármű és időpont kiválasztása.
- **Foglalásaim:** korábbi és aktuális foglalások megtekintése.
- **Profilom:** személyes adatok kezelése.

### Dolgozói felület

- **Munkáim:** a dolgozóhoz rendelt javítások listája.
- **Javítás részletei:** a gépjármű és a javítás adatainak megtekintése.
- **Állapotkezelés:** a javítás aktuális állapotának módosítása és megjegyzés hozzáadása.

### Adminisztrációs felület

- **Dashboard:** foglalások és folyamatban lévő javítások összefoglalója.
- **Foglalások:** beérkezett időpontfoglalások kezelése.
- **Javítások:** munkák létrehozása, szerkesztése és dolgozóhoz rendelése.
- **Felhasználók és dolgozók:** fiókok megtekintése és kezelése.
- **Szolgáltatások:** a szerviz szolgáltatásainak kezelése.

---

## 5. Drótváz- és dizájnelvek

A weboldal célja az egyszerű és könnyen átlátható használat.

- Letisztult, modern, autószervizhez illő megjelenés.
- Jól olvasható szövegek és megfelelő színkontraszt.
- Egységes fejléc és navigáció.
- Az adminisztrációs és dolgozói felületen oldalsó menü.
- A foglalások és javítások táblázatos megjelenítése.
- Mobilon is kényelmesen használható menük, űrlapok és táblázatok.

A drótvázterv Figma segítségével készül el. A cél, hogy előre látható legyen, melyik oldalon milyen funkciók és elemek szerepelnek.

---

## 6. Adatbázis-tervezet

Az alkalmazás adatainak tárolásához összekapcsolt táblákat tervezünk. Az iskolai követelményeknek megfelelően az adatbázis tervezete **json-server** formátumra épül.

### Tervezett táblák

| Tábla | Fontosabb mezők | Leírás |
|---|---|---|
| **Users** | `id`, `name`, `email`, `passwordHash`, `role`, `phone` | Az ügyfelek és a rendszer felhasználóinak adatai. |
| **Vehicles** | `id`, `userId`, `brand`, `model`, `year`, `licensePlate` | Az ügyfelek gépjárművei. |
| **Employees** | `id`, `userId`, `specialization` | A szerviz dolgozóinak adatai. |
| **Services** | `id`, `name`, `description`, `price` | A szervizben elérhető szolgáltatások. |
| **Appointments** | `id`, `userId`, `vehicleId`, `serviceId`, `appointmentDate`, `status` | Az ügyfelek időpontfoglalásai. |
| **Repairs** | `id`, `appointmentId`, `employeeId`, `description`, `status` | A foglalásokhoz tartozó javítási munkák. |

### Táblák közötti kapcsolatok

- Egy felhasználóhoz több gépjármű tartozhat.
- Egy felhasználó több időpontot is foglalhat.
- Egy gépjárműhöz több foglalás tartozhat.
- Egy szolgáltatásra több foglalás érkezhet.
- Egy foglaláshoz egy javítási munka tartozhat.
- Egy dolgozó több javításért is felelhet.

### Egyszerűsített kapcsolati ábra

```text
Users
 ├──< Vehicles
 └──< Appointments >── Services
              │
              └── Repairs >── Employees
```

### Minta JSON-adat

```json
{
  "users": [
    {
      "id": "1",
      "name": "Kiss Péter",
      "email": "peter@example.com",
      "passwordHash": "HASHED_PASSWORD",
      "role": "user"
    }
  ],
  "vehicles": [
    {
      "id": "1",
      "userId": "1",
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2018,
      "licensePlate": "ABC-123"
    }
  ],
  "services": [],
  "employees": [],
  "appointments": [],
  "repairs": []
}
```

A rekordok azonosítók segítségével hivatkoznak egymásra. A felhasználók jelszavát nem szabad nyers formában tárolni; csak hash-elt jelszó kerülhet az adatbázisba. A jogosultságokat és az adatokhoz való hozzáférést a backend ellenőrzi.

---

## 7. Technológiák

| Terület | Tervezett technológia |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **CSS framework** | Tailwind CSS |
| **Backend** | Az iskolában használt backendtechnológia |
| **Adatkezelés** | json-server |
| **Kommunikáció** | REST API, JSON |
| **Verziókezelés** | Git, GitHub |
| **Drótvázterv** | Figma |

A frontend HTTP-kéréseken keresztül kommunikál a backenddel, az adatok átadása JSON formátumban történik.

---

## 8. Célcsoport és a projekt előnyei

### Fő célcsoport: 25–60 év közötti gépjármű-tulajdonosok

A weboldal elsősorban azoknak szól, akik online szeretnének időpontot foglalni, és egyszerűen szeretnék nyomon követni autójuk szervizelését.

A rendszer a szerviz dolgozóinak és vezetőinek is segítséget nyújt a foglalások és javítások áttekintésében.

### Miért jó választás?

- **Valós felhasználási terület:** egy autószerviz mindennapi működését modellezi.
- **Több jogosultsági szint:** az ügyfelek, dolgozók és adminisztrátorok eltérő feladatokat végeznek.
- **Összekapcsolt adatbázis:** a felhasználók, gépjárművek, foglalások és javítások között természetes kapcsolatok vannak.
- **Jól bemutatható működés:** egy időpontfoglalástól a javítás lezárásáig követhető a teljes folyamat.
- **Bővíthető, de egyszerűsíthető:** az alapfunkciók két hónap alatt is megvalósíthatók.

---

## 9. Összegzés

Az **Autószerviz-kezelő** egy reszponzív fullstack webalkalmazás, amely az ügyfelek, a szerviz dolgozói és az adminisztrátorok munkáját támogatja. Az ügyfelek gépjárműveket rögzíthetnek és időpontot foglalhatnak, a dolgozók kezelhetik a hozzájuk rendelt javításokat, az adminisztrátor pedig felügyelheti a rendszer működését.

A projekt célja egy átlátható, könnyen használható alkalmazás elkészítése, amely bemutatja a frontend és backend közötti JSON-alapú kommunikációt, a felhasználói jogosultságkezelést és az összekapcsolt adatbázis használatát.
