import {
  isMonday,
  parseISODate,
  restaurant,
  seatingsFor,
  toISODate,
} from "@/lib/restaurant"

// The fields a guest submits when requesting a table. The reference id and
// createdAt are assigned by the Worker, not the browser.
export type ReservationRequest = {
  name: string
  phone: string
  date: string
  time: string
  partySize: number
  note: string
}

export type ReservationFieldName =
  | "name"
  | "phone"
  | "date"
  | "time"
  | "partySize"
  | "note"

export type ReservationFieldErrors = Partial<
  Record<ReservationFieldName, string>
>

// Raw input as it arrives from the form (strings) or a JSON body (unknown
// until checked). partySize may be a string from a <select>.
export type ReservationInput = {
  name: string
  phone: string
  date: string
  time: string
  partySize: string | number
  note: string
}

export function toReservationInput(value: unknown): ReservationInput | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  if (
    typeof record.name !== "string" ||
    typeof record.phone !== "string" ||
    typeof record.date !== "string" ||
    typeof record.time !== "string" ||
    (typeof record.partySize !== "string" &&
      typeof record.partySize !== "number") ||
    typeof record.note !== "string"
  ) {
    return null
  }
  return {
    name: record.name,
    phone: record.phone,
    date: record.date,
    time: record.time,
    partySize: record.partySize,
    note: record.note,
  }
}

export function seatingHasPassed(date: Date, time: string, now = new Date()) {
  const [hour, minute] = time.split(":").map(Number)
  const slot = new Date(date)
  slot.setHours(hour, minute, 0, 0)
  return slot.getTime() < now.getTime()
}

export function validateReservationInput(
  input: ReservationInput,
  now = new Date()
): ReservationFieldErrors {
  const errors: ReservationFieldErrors = {}
  const name = input.name.trim()
  if (name.length < 2) {
    errors.name = "Add the name the table should be held under."
  } else if (name.length > 80) {
    errors.name = "Use a shorter name, under 80 characters."
  }

  const digits = input.phone.replace(/\D/g, "")
  if (digits.length < 8 || digits.length > 15) {
    errors.phone =
      "Add a phone number the house can call, with at least 8 digits."
  }

  const date = parseISODate(input.date)
  const today = parseISODate(toISODate(now))
  if (!date || !today) {
    errors.date = "Choose the day you want to sit."
  } else if (date < today) {
    errors.date = "That day has already passed."
  } else if (isMonday(date)) {
    errors.date =
      "The house is closed on Mondays. Choose Tuesday through Sunday."
  } else {
    const latest = new Date(today)
    latest.setDate(latest.getDate() + restaurant.bookingWindowDays)
    if (date > latest) {
      errors.date = `Tables open ${restaurant.bookingWindowDays} days ahead. Pick an earlier day.`
    }
  }

  if (!errors.date && date) {
    const allowed = seatingsFor(date).some(
      (seating) => seating.value === input.time
    )
    if (!input.time || !allowed) {
      errors.time = "Choose a seating that is open that day."
    } else if (seatingHasPassed(date, input.time, now)) {
      errors.time = "That seating has already started. Choose a later time."
    }
  } else if (!input.time) {
    errors.time = "Choose a seating."
  }

  const party = Number(input.partySize)
  if (!Number.isInteger(party) || party < 1 || party > restaurant.maxParty) {
    errors.partySize = `Parties of 1 to ${restaurant.maxParty} can book here. For more seats, call the house.`
  }

  if (input.note.trim().length > 240) {
    errors.note = "Keep the note under 240 characters."
  }

  return errors
}

// Call only after validateReservationInput returned no errors.
export function toReservationRequest(input: ReservationInput): ReservationRequest {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    date: input.date,
    time: input.time,
    partySize: Number(input.partySize),
    note: input.note.trim(),
  }
}
