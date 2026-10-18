"use client"

import { useId, useMemo, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  formatLongDate,
  isMonday,
  parseISODate,
  restaurant,
  seatingsFor,
  toISODate,
} from "@/lib/restaurant"
import {
  createReservationId,
  eraseReservations,
  getServerReservationStore,
  isPastSeating,
  readReservationStore,
  replaceReservations,
  subscribeReservations,
  type Reservation,
} from "@/lib/reservations"
import { cn } from "cn"

type FieldName = "name" | "phone" | "date" | "time" | "partySize" | "note"

type FormState = {
  name: string
  phone: string
  date: string
  time: string
  partySize: string
  note: string
}

const emptyForm: FormState = {
  name: "",
  phone: "",
  date: "",
  time: "",
  partySize: "",
  note: "",
}

const fieldClass =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"

function seatingHasPassed(date: Date, time: string, now = new Date()) {
  const [hour, minute] = time.split(":").map(Number)
  const slot = new Date(date)
  slot.setHours(hour, minute, 0, 0)
  return slot.getTime() < now.getTime()
}

function validate(form: FormState, now = new Date()) {
  const errors: Partial<Record<FieldName, string>> = {}
  const name = form.name.trim()
  if (name.length < 2) {
    errors.name = "Add the name the table should be held under."
  } else if (name.length > 80) {
    errors.name = "Use a shorter name, under 80 characters."
  }

  const digits = form.phone.replace(/\D/g, "")
  if (digits.length < 8 || digits.length > 15) {
    errors.phone = "Add a phone number the house can call, with at least 8 digits."
  }

  const date = parseISODate(form.date)
  const today = parseISODate(toISODate(now))
  if (!date || !today) {
    errors.date = "Choose the day you want to sit."
  } else if (date < today) {
    errors.date = "That day has already passed."
  } else if (isMonday(date)) {
    errors.date = "The house is closed on Mondays. Choose Tuesday through Sunday."
  } else {
    const latest = new Date(today)
    latest.setDate(latest.getDate() + restaurant.bookingWindowDays)
    if (date > latest) {
      errors.date = `Tables open ${restaurant.bookingWindowDays} days ahead. Pick an earlier day.`
    }
  }

  if (!errors.date && date) {
    const allowed = seatingsFor(date).some((seating) => seating.value === form.time)
    if (!form.time || !allowed) {
      errors.time = "Choose a seating that is open that day."
    } else if (seatingHasPassed(date, form.time, now)) {
      errors.time = "That seating has already started. Choose a later time."
    }
  } else if (!form.time) {
    errors.time = "Choose a seating."
  }

  const party = Number(form.partySize)
  if (!Number.isInteger(party) || party < 1 || party > restaurant.maxParty) {
    errors.partySize = `Parties of 1 to ${restaurant.maxParty} can book here. For more seats, call the house.`
  }

  if (form.note.trim().length > 240) {
    errors.note = "Keep the note under 240 characters."
  }

  return errors
}

export function ReservationDesk() {
  const baseId = useId()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [pending, setPending] = useState(false)
  const [confirmed, setConfirmed] = useState<Reservation | null>(null)
  const [storageError, setStorageError] = useState<string | null>(null)
  const store = useSyncExternalStore(
    subscribeReservations,
    readReservationStore,
    getServerReservationStore
  )

  const selectedDate = parseISODate(form.date)
  const seatings = useMemo(() => {
    const date = parseISODate(form.date)
    if (!date || isMonday(date)) return []
    return seatingsFor(date)
  }, [form.date])

  const today = toISODate(new Date())
  const latestDate = new Date()
  latestDate.setDate(latestDate.getDate() + restaurant.bookingWindowDays)
  const maxDate = toISODate(latestDate)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function persist(next: Reservation[]) {
    replaceReservations(next)
    setStorageError(null)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0]
      document.getElementById(`${baseId}-${first}`)?.focus()
      return
    }

    setPending(true)
    window.setTimeout(() => {
      try {
        const currentStore = readReservationStore()
        const existing =
          currentStore.status === "ready" ? currentStore.reservations : []
        const reservation: Reservation = {
          id: createReservationId(existing),
          name: form.name.trim(),
          phone: form.phone.trim(),
          date: form.date,
          time: form.time,
          partySize: Number(form.partySize),
          note: form.note.trim(),
          createdAt: new Date().toISOString(),
        }
        persist([reservation, ...existing])
        setConfirmed(reservation)
        setForm(emptyForm)
      } catch {
        setStorageError(
          "This browser blocked saving the reservation. You can try again, or call the house."
        )
      } finally {
        setPending(false)
      }
    }, 400)
  }

  function removeReservation(id: string) {
    if (store.status !== "ready") return
    try {
      persist(store.reservations.filter((reservation) => reservation.id !== id))
      if (confirmed?.id === id) setConfirmed(null)
    } catch {
      setStorageError("The reservation could not be removed from this device.")
    }
  }

  function resetStorage() {
    try {
      eraseReservations()
      setConfirmed(null)
      setStorageError(null)
    } catch {
      setStorageError("This browser would not clear the saved reservations.")
    }
  }

  const lunch = seatings.filter((seating) => seating.service === "Lunch")
  const dinner = seatings.filter((seating) => seating.service === "Dinner")

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div>
        {confirmed ? (
          <Card className="bg-card">
            <CardHeader>
              <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
                Noted
              </p>
              <CardTitle className="font-heading text-3xl">
                The table is held under {confirmed.name}
              </CardTitle>
              <CardDescription>
                Reference {confirmed.id}. The house confirms by phone at{" "}
                {confirmed.phone}. Please arrive within {restaurant.holdMinutes}{" "}
                minutes of the seating.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Day</dt>
                  <dd className="mt-1 font-medium">{formatLongDate(confirmed.date)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Seating</dt>
                  <dd className="mt-1 font-medium">{confirmed.time}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Party</dt>
                  <dd className="mt-1 font-medium">
                    {confirmed.partySize}{" "}
                    {confirmed.partySize === 1 ? "guest" : "guests"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="mt-1 font-medium">{confirmed.id}</dd>
                </div>
              </dl>
              {confirmed.note ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Note for the kitchen: {confirmed.note}
                </p>
              ) : null}
            </CardContent>
            <CardFooter className="bg-transparent">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-4"
                onClick={() => setConfirmed(null)}
              >
                Request another table
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <Field
              id={`${baseId}-name`}
              label="Name"
              error={errors.name}
            >
              <Input
                id={`${baseId}-name`}
                name="name"
                autoComplete="name"
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
                className="h-11"
                onChange={(event) => update("name", event.target.value)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${baseId}-phone`} label="Phone" error={errors.phone}>
                <Input
                  id={`${baseId}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+86 …"
                  value={form.phone}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? `${baseId}-phone-error` : undefined
                  }
                  className="h-11"
                  onChange={(event) => update("phone", event.target.value)}
                />
              </Field>
              <Field
                id={`${baseId}-partySize`}
                label="Party size"
                error={errors.partySize}
              >
                <select
                  id={`${baseId}-partySize`}
                  name="partySize"
                  value={form.partySize}
                  aria-invalid={Boolean(errors.partySize)}
                  aria-describedby={
                    errors.partySize ? `${baseId}-partySize-error` : undefined
                  }
                  className={cn(fieldClass, "bg-card")}
                  onChange={(event) => update("partySize", event.target.value)}
                >
                  <option value="">Select</option>
                  {Array.from({ length: restaurant.maxParty }, (_, index) => {
                    const size = index + 1
                    return (
                      <option key={size} value={size}>
                        {size} {size === 1 ? "guest" : "guests"}
                      </option>
                    )
                  })}
                </select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${baseId}-date`} label="Date" error={errors.date}>
                <Input
                  id={`${baseId}-date`}
                  name="date"
                  type="date"
                  min={today}
                  max={maxDate}
                  value={form.date}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? `${baseId}-date-error` : undefined}
                  className="h-11"
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((current) => {
                      const date = parseISODate(value)
                      const stillOpen =
                        date &&
                        !isMonday(date) &&
                        seatingsFor(date).some(
                          (seating) => seating.value === current.time
                        ) &&
                        !seatingHasPassed(date, current.time)
                      return {
                        ...current,
                        date: value,
                        time: stillOpen ? current.time : "",
                      }
                    })
                    setErrors((current) => ({
                      ...current,
                      date: undefined,
                      time: undefined,
                    }))
                  }}
                />
              </Field>
              <Field id={`${baseId}-time`} label="Seating" error={errors.time}>
                <select
                  id={`${baseId}-time`}
                  name="time"
                  value={form.time}
                  disabled={!selectedDate || isMonday(selectedDate)}
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={errors.time ? `${baseId}-time-error` : undefined}
                  className={cn(fieldClass, "disabled:opacity-50")}
                  onChange={(event) => update("time", event.target.value)}
                >
                  <option value="">
                    {selectedDate ? "Select a time" : "Choose a date first"}
                  </option>
                  {lunch.length > 0 ? (
                    <optgroup label="Lunch">
                      {lunch.map((seating) => (
                        <option
                          key={seating.value}
                          value={seating.value}
                          disabled={
                            selectedDate
                              ? seatingHasPassed(selectedDate, seating.value)
                              : false
                          }
                        >
                          {seating.value}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {dinner.length > 0 ? (
                    <optgroup label="Dinner">
                      {dinner.map((seating) => (
                        <option
                          key={seating.value}
                          value={seating.value}
                          disabled={
                            selectedDate
                              ? seatingHasPassed(selectedDate, seating.value)
                              : false
                          }
                        >
                          {seating.value}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </select>
              </Field>
            </div>

            <Field
              id={`${baseId}-note`}
              label="Note for the kitchen"
              hint="Optional. Allergies, a high chair, a quiet corner."
              error={errors.note}
            >
              <Textarea
                id={`${baseId}-note`}
                name="note"
                value={form.note}
                maxLength={280}
                aria-invalid={Boolean(errors.note)}
                aria-describedby={
                  errors.note ? `${baseId}-note-error` : `${baseId}-note-hint`
                }
                className="min-h-24"
                onChange={(event) => update("note", event.target.value)}
              />
            </Field>

            <Button type="submit" className="h-11 px-5" disabled={pending}>
              {pending ? "Holding the table…" : "Request this table"}
            </Button>
          </form>
        )}
      </div>

      <aside aria-live="polite">
        <h2 className="font-heading text-2xl tracking-tight">
          Reservations on this device
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Nothing is sent to a booking desk. The list below is what this browser
          has kept.
        </p>

        {storageError || store.status === "error" ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm"
          >
            <p>
              {storageError ??
                (store.status === "error" ? store.message : "")}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-10"
              onClick={resetStorage}
            >
              Clear saved reservations
            </Button>
          </div>
        ) : null}

        {store.status === "loading" ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Looking up reservations saved on this device…
          </p>
        ) : store.status === "ready" && store.reservations.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-border px-4 py-8 text-sm leading-6 text-muted-foreground">
            No reservations in this browser yet. Request a table and it will
            show here, with a reference you can read back to the house.
          </p>
        ) : store.status === "ready" ? (
          <ul className="mt-6 space-y-3">
            {store.reservations.map((reservation) => {
              const past = isPastSeating(reservation)
              return (
                <li
                  key={reservation.id}
                  className="rounded-xl border border-border bg-card px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {formatLongDate(reservation.date)} · {reservation.time}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {reservation.name} · {reservation.partySize}{" "}
                        {reservation.partySize === 1 ? "guest" : "guests"} ·{" "}
                        {reservation.id}
                      </p>
                      {past ? (
                        <p className="mt-1 text-xs tracking-wide text-cinnabar uppercase">
                          Past seating
                        </p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-9 px-2 text-muted-foreground"
                      onClick={() => removeReservation(reservation.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : null}
      </aside>
    </div>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
