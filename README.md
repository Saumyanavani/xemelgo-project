# Xemelgo Dashboard Management

A localhost React demo for the Xemelgo take-home assignment. The app uses a persistent local database with IndexedDB via Dexie, mocked login and user switching, and seeded data for asset, inventory, and work order flows.

## Stack

- React + Vite + TypeScript
- React Router
- Dexie / IndexedDB

## Running locally

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## What is implemented

- Mocked login with seeded users
- User switcher available on authenticated pages
- Main dashboard with all 12 seeded items across the three solution types
- Solution-type row highlighting on the dashboard
- Shared item detail page for Asset, Inventory, and Work Order items
- Location history highlighting by location
- Action history highlighting by user
- Location-based actions:
  - Asset: `Move to`
  - Inventory: `Scan at`
  - Work Order: `Receive at`
- Terminal actions:
  - Asset: `Missing`
  - Inventory: `Consume`
  - Work Order: `Complete`
- Persisted local state so changes survive refresh
- Reset demo data action in the header

## Architecture notes

- The UI is fully React as required.
- Data is stored locally in IndexedDB to satisfy the “database locally or in the cloud” requirement while keeping the project free and self-contained.
- All reads and writes go through `src/data/dataService.ts`, so the Dexie implementation can be swapped for API calls later if needed.
- Authentication is intentionally mocked to keep the time spent on the assignment focused on the dashboard behaviors.

## Seeded demo data

- 4 users
- 4 locations
- 12 items total
- 6 seeded location events and 6 seeded action events per item

## Assumptions

- The PDF is the source of truth and the mockups are visual guidance.
- The top-right user switcher represents the acting user for future action-history entries.
- Terminal items can be reactivated by a later location-based action.
- Immediate in-app updates are sufficient; no external real-time feed was implemented.
- A localhost submission is acceptable per the brief.
