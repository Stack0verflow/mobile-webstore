# Mobile webstore
Ez a projekt egy Angular-alapú webáruház frontendből (`client/mobile-webstore`) és egy Node.js (Express) backendből (`server`) áll.

## Telepítés és futtatás

### 1. Repository klónozása

```bash
git clone https://github.com/Stack0verflow/mobile-webstore.git
cd mobile-webstore
```

### 2. Függőségek telepítése
Telepítsd a függőségeket mind a frontendhez, mind a backendhez:

```bash
cd client/mobile-webstore
npm install
cd ../../server
npm install
```

### 3. Projekt indítása
Nyiss a gyökérkönyvtárból két terminált, Git Bash ablakot, vagy egyéb általad használt variánst!

Az elsőben indítsd el a frontendet:

```bash
cd client/mobile-webstore
ng serve
```

A másodikban indítsd el a backendet:
```bash
cd server
npm run build
npm run start
```

Ez elindítja a frontendet a `http://localhost:4200/` címen, illetve a szervert a `8080`-as porton.

## Kiegészítés
Ellenőrizd, hogy az Angular CLI globálisan telepítve van. Ha mégsem, akkor az alábbi paranccsal telepítheted:
```bash
npm install -g @angular/cli
```