# Shanghai Shikumen Fine Cuisine

A small website for a Shanghainese restaurant in Richmond Hill, Ontario: the story of the room, a short menu with photographs, and a table request you can complete in the browser.

A table request is emailed to the restaurant by a Cloudflare Worker (`worker/index.ts`, `POST /api/reservations`) through [Resend](https://resend.com). The browser also keeps a copy in `localStorage` so the guest can read the reference back when the house calls; removing that copy does not cancel the table.

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

## Reservation email

The Worker needs three values:

- `RESEND_API_KEY` — from [resend.com/api-keys](https://resend.com/api-keys)
- `RESEND_FROM_EMAIL` — a sender on a domain verified in Resend (`onboarding@resend.dev` works for a first test, but only delivers to the Resend account address)
- `RESTAURANT_NOTIFY_EMAIL` — the inbox the restaurant reads

Locally, copy `.dev.vars.example` to `.dev.vars` and fill it in, then run the Worker next to the dev server:

```bash
npm run dev      # pages on http://127.0.0.1:43123
npm run worker   # API on http://127.0.0.1:8787 (builds the static export first)
```

The form posts to the Worker on 8787 in development and to `/api/reservations` on the deployed site.

The lockfile has to be produced by npm 10.9.2, which is what Cloudflare’s build image runs. A newer npm omits optional packages that `npm ci` then reports as out of sync. `package.json` pins that version; use `npx npm@10.9.2 install` when dependencies change.

To deploy, set the secrets once and publish:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM_EMAIL
npx wrangler secret put RESTAURANT_NOTIFY_EMAIL
npm run deploy
```

## Pages

- **Home** — the dining room, a few signature dishes, and a way to the reservation form
- **Story** — what a shikumen gate is, and how the kitchen cooks
- **Menu** — cold dishes, dumplings, braises, noodles
- **Reserve** — name, phone, date, seating, party size, and an optional note, with validation, an email to the house, and a confirmation
