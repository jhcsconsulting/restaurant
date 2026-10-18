import { restaurant } from "@/lib/restaurant"

export type Reservation = {
  id: string
  name: string
  phone: string
  date: string
  time: string
  partySize: number
  note: string
  createdAt: string
}

const STORAGE_KEY = "shikumen-reservations"

function isReservation(value: unknown): value is Reservation {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.phone === "string" &&
    typeof record.date === "string" &&
    typeof record.time === "string" &&
    typeof record.partySize === "number" &&
    typeof record.note === "string" &&
    typeof record.createdAt === "string"
  )
}

export function loadReservations(): Reservation[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed) || !parsed.every(isReservation)) {
    throw new Error("Saved reservations could not be read")
  }
  return parsed
}

export function saveReservations(reservations: Reservation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
}

export function clearReservations() {
  localStorage.removeItem(STORAGE_KEY)
}

export type ReservationStore =
  | { status: "loading" }
  | { status: "ready"; reservations: Reservation[] }
  | { status: "error"; message: string }

const serverStore: ReservationStore = { status: "loading" }
const listeners = new Set<() => void>()
let snapshot: ReservationStore = serverStore
let snapshotRaw: string | null | undefined

function emit(next: ReservationStore, raw: string | null) {
  snapshot = next
  snapshotRaw = raw
  listeners.forEach((listener) => listener())
}

export function subscribeReservations(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return
    snapshotRaw = undefined
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function readReservationStore(): ReservationStore {
  if (typeof window === "undefined") return serverStore
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    if (snapshot.status === "error") return snapshot
    snapshot = {
      status: "error",
      message:
        "This browser blocked saved reservations. You can still fill the form, but it will not be kept after you leave.",
    }
    snapshotRaw = undefined
    return snapshot
  }

  if (snapshotRaw === raw && snapshot.status !== "loading") return snapshot
  snapshotRaw = raw
  try {
    snapshot = {
      status: "ready",
      reservations: sortReservations(loadReservations()),
    }
  } catch {
    snapshot = {
      status: "error",
      message:
        "Reservations saved on this device could not be read. Clear them to start again.",
    }
  }
  return snapshot
}

export function getServerReservationStore() {
  return serverStore
}

export function replaceReservations(reservations: Reservation[]) {
  saveReservations(reservations)
  emit(
    { status: "ready", reservations: sortReservations(reservations) },
    localStorage.getItem(STORAGE_KEY)
  )
}

export function eraseReservations() {
  clearReservations()
  emit({ status: "ready", reservations: [] }, null)
}

export function createReservationId(existing: Reservation[]) {
  const taken = new Set(existing.map((reservation) => reservation.id))
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = `SK-${Math.floor(1000 + Math.random() * 9000)}`
    if (!taken.has(id)) return id
  }
  return `SK-${Date.now().toString().slice(-6)}`
}

export function sortReservations(reservations: Reservation[]) {
  return [...reservations].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    return byDate
  })
}

export function isPastSeating(reservation: Reservation, now = new Date()) {
  const [year, month, day] = reservation.date.split("-").map(Number)
  const [hour, minute] = reservation.time.split(":").map(Number)
  const seating = new Date(year, month - 1, day, hour, minute, 0, 0)
  return seating.getTime() + restaurant.holdMinutes * 60 * 1000 < now.getTime()
}
