# Monorail EG - Cairo Monorail Capstone Project

A backend system for Cairo's two monorail lines: NAC and 6th October.

---

## Setup

```bash
npm install
cp .env.example .env
```

---

## Step 1 - Fill in stationUtils.js

Three functions. Do these first — everything else depends on them.

| TODO | Function | What it does |
|------|----------|--------------|
| 1 | `getAllStations` | Read stations.json and return the array |
| 2 | `getStationsByLine` | Filter stations by line name |
| 3 | `calculateFare` | Calculate fare based on zone difference |

---

## Step 2 - Build the CLI (monorail.js)

```bash
node monorail.js stations
node monorail.js line NAC
node monorail.js fare Heliopolis "NAC Central"
```

| TODO | Command | What to do |
|------|---------|------------|
| 1 | `stations` | Print all stations |
| 2 | `line <name>` | Print stations on that line |
| 3 | `fare <from> <to>` | Print fare estimate |

---

## Step 3 - Build the Express server (server.js)

```bash
npm run dev
```

| TODO | What to do |
|------|------------|
| 1 | Logger middleware - print method + URL, call next() |
| 2 | GET /stations - return all stations as JSON |

---

## Done when

- [ ] `node monorail.js stations` prints 8 stations
- [ ] `node monorail.js fare Heliopolis "NAC Central"` prints 11 EGP
- [ ] `npm run dev` starts without errors
- [ ] GET /stations returns JSON in Postman
