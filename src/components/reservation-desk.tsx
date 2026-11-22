"use client"

import { useId, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react"
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
  parseISODate,
  restaurant,
  toISODate,
} from "@/lib/restaurant"
import {
  eraseReservations,
  getServerReservationStore,
  isPastSeating,
  isReservation,
  readReservationStore,
  replaceReservations,
  subscribeReservations,
  type Reservation,
} from "@/lib/reservations"
import {
  seatingHasPassed,
  validateReservationInput,
} from "@/lib/reservation-request"
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

// In development `next dev` serves the pages while `wrangler dev` answers the
// API on 8787. Deployed, the Worker serves both on one origin.
const RESERVATION_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8787/api/reservations"
    : "/api/reservations"

const SEND_FAILURE_MESSAGE =
  "The request could not reach the house. Try again in a moment, or call."

export function ReservationDesk() {
  const baseId = useId()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [pending, setPending] = useState(false)
  const [confirmed, setConfirmed] = useState<Reservation | null>(null)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const store = useSyncExternalStore(
    subscribeReservations,
    readReservationStore,
    getServerReservationStore
  )

  const selectedDate = parseISODate(form.date)

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

  function focusField(name: string) {
    document.getElementById(`${baseId}-${name}`)?.focus()
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateReservationInput(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusField(Object.keys(nextErrors)[0])
      return
    }

    setPending(true)
    setSubmitError(null)
    try {
      const response = await fetch(RESERVATION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          date: form.date,
          time: form.time,
          partySize: Number(form.partySize),
          note: form.note.trim(),
        }),
      })
      const payload: unknown = await response.json().catch(() => null)
      const record =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>)
          : null

      if (response.ok && record && isReservation(record.reservation)) {
        const reservation = record.reservation
        setConfirmed(reservation)
        setForm(emptyForm)
        try {
          const currentStore = readReservationStore()
          const existing =
            currentStore.status === "ready" ? currentStore.reservations : []
          persist([reservation, ...existing])
        } catch {
          // The house already has the email; only the local copy failed.
          setStorageError(
            "The request reached the house, but this browser blocked keeping a copy. Note the reference above."
          )
        }
        return
      }

      if (
        response.status === 400 &&
        record &&
        typeof record.errors === "object" &&
        record.errors
      ) {
        const serverErrors = record.errors as Partial<
          Record<FieldName, string>
        >
        setErrors(serverErrors)
        const first = Object.keys(serverErrors)[0]
        if (first) focusField(first)
        return
      }

      setSubmitError(
        record && typeof record.message === "string"
          ? record.message
          : SEND_FAILURE_MESSAGE
      )
    } catch {
      setSubmitError(SEND_FAILURE_MESSAGE)
    } finally {
      setPending(false)
    }
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
                Reference {confirmed.id}. The request has been emailed to the
                house, which confirms by phone at {confirmed.phone}.                 Please
                arrive within {restaurant.holdMinutes} minutes of the time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Day</dt>
                  <dd className="mt-1 font-medium">{formatLongDate(confirmed.date)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Time</dt>
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
                  placeholder="+1 …"
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
                  {Array.from(
                    { length: restaurant.maxParty - restaurant.minParty + 1 },
                    (_, index) => {
                      const size = restaurant.minParty + index
                      return (
                        <option key={size} value={size}>
                          {size} guests
                        </option>
                      )
                    }
                  )}
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
                        date !== null &&
                        /^([01]\d|2[0-3]):[0-5]\d$/.test(current.time) &&
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
              <Field id={`${baseId}-time`} label="Time" error={errors.time}>
                <Input
                  id={`${baseId}-time`}
                  name="time"
                  type="time"
                  value={form.time}
                  disabled={!selectedDate}
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={
                    errors.time ? `${baseId}-time-error` : undefined
                  }
                  className="h-11 disabled:opacity-50"
                  onChange={(event) => update("time", event.target.value)}
                />
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

            {submitError ? (
              <p
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm"
              >
                {submitError}
              </p>
            ) : null}

            <Button type="submit" className="h-11 px-5" disabled={pending}>
              {pending ? "Sending to the house…" : "Request this table"}
            </Button>
          </form>
        )}
      </div>

      <aside aria-live="polite">
        <h2 className="font-heading text-2xl tracking-tight">
          Reservations on this device
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Each request is emailed to the house. The list below is only the copy
          this browser has kept — removing a line here does not cancel the
          table. To cancel, call the house.
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
                          Past time
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
