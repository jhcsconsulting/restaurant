# Shanghai Shikumen Fine Cuisine

A small website for a Shanghainese restaurant in a shikumen lane house: the story of the room, a short menu with photographs, and a table request you can complete in the browser.

Reservations stay in this browser (`localStorage`). They are not sent to a server. The confirmation is a reference you can read back when the house calls.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm run lint
npm run build
```

## Pages

- **Home** — the dining room, a few signature dishes, and a way to the reservation form
- **Story** — what a shikumen gate is, and how the kitchen cooks
- **Menu** — cold dishes, dumplings, braises, noodles
- **Reserve** — name, phone, date, seating, party size, and an optional note, with validation and a confirmation