import {
  toReservationInput,
  toReservationRequest,
  validateReservationInput,
  type ReservationRequest,
} from "../src/lib/reservation-request"
import { formatLongDate, restaurant } from "../src/lib/restaurant"

type Env = {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  RESEND_API_KEY?: string
  RESEND_FROM_EMAIL?: string
  RESTAURANT_NOTIFY_EMAIL?: string
}

// `next dev` serves the site on this origin while `wrangler dev` answers the
// API on 8787, so the browser needs a CORS handshake in local development.
// Deployed, the Worker serves both the assets and the API on one origin.
const DEV_ORIGIN = "http://127.0.0.1:43123"

const GUEST_FACING_FAILURE =
  "The request could not reach the house. Try again in a moment, or call."

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin")
  if (origin !== DEV_ORIGIN) return {}
  return {
    "Access-Control-Allow-Origin": DEV_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

function json(request: Request, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request),
    },
  })
}

function createReservationId() {
  return `SK-${Math.floor(1000 + Math.random() * 9000)}`
}

function reservationEmail(reservation: ReservationRequest & { id: string }) {
  const party = `${reservation.partySize} ${
    reservation.partySize === 1 ? "guest" : "guests"
  }`
  const day = formatLongDate(reservation.date)
  const subject = `Table request ${reservation.id} — ${day}, ${reservation.time}, ${party}`
  const lines = [
    `A table was requested through the website.`,
    ``,
    `Name: ${reservation.name}`,
    `Phone: ${reservation.phone}`,
    `Day: ${day}`,
    `Seating: ${reservation.time}`,
    `Party: ${party}`,
    `Reference: ${reservation.id}`,
  ]
  if (reservation.note) {
    lines.push(``, `Note for the kitchen:`, reservation.note)
  }
  lines.push(
    ``,
    `The guest was told the house confirms by phone and that the table is held for ${restaurant.holdMinutes} minutes.`
  )
  return { subject, text: lines.join("\n") }
}

async function handleReservation(request: Request, env: Env) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(request, 400, { message: "The request could not be read." })
  }

  const input = toReservationInput(body)
  if (!input) {
    return json(request, 400, { message: "The request could not be read." })
  }

  const errors = validateReservationInput(input)
  if (Object.keys(errors).length > 0) {
    return json(request, 400, { errors })
  }

  if (
    !env.RESEND_API_KEY ||
    !env.RESEND_FROM_EMAIL ||
    !env.RESTAURANT_NOTIFY_EMAIL
  ) {
    console.error(
      "Reservation email is not configured: set RESEND_API_KEY, RESEND_FROM_EMAIL, and RESTAURANT_NOTIFY_EMAIL."
    )
    return json(request, 500, { message: GUEST_FACING_FAILURE })
  }

  const reservation = {
    id: createReservationId(),
    ...toReservationRequest(input),
    createdAt: new Date().toISOString(),
  }

  const { subject, text } = reservationEmail(reservation)
  const send = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: env.RESTAURANT_NOTIFY_EMAIL,
      subject,
      text,
    }),
  })

  if (!send.ok) {
    console.error(
      `Resend rejected the reservation email (${send.status}): ${await send
        .text()
        .catch(() => "")}`
    )
    return json(request, 502, { message: GUEST_FACING_FAILURE })
  }

  return json(request, 201, { reservation })
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === "/api/reservations") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders(request) })
      }
      if (request.method === "POST") {
        return handleReservation(request, env)
      }
      return json(request, 405, { message: "Method not allowed." })
    }
    return env.ASSETS.fetch(request)
  },
}

export default worker
