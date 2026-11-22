import type { Metadata } from "next"
import { Suspense } from "react"
import { ReservationDesk } from "@/components/reservation-desk"
import { restaurant } from "@/lib/restaurant"

export const metadata: Metadata = {
  title: "Reserve a table",
  description:
    "Request a table at Shanghai Shikumen Fine Cuisine in Richmond Hill. Parties of four to twenty, any day, any time.",
}

export default function ReservePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
          Reservations
        </p>
        <h1 className="mt-3 font-heading text-5xl tracking-tight sm:text-6xl">
          A table in Richmond Hill
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Open every day, any time. Parties of {restaurant.minParty} to{" "}
          {restaurant.maxParty}. For a private room, call{" "}
          <a
            href={restaurant.phoneHref}
            className="text-foreground underline-offset-4 hover:underline"
          >
            {restaurant.phone}
          </a>
          . A request made here is emailed to the house, and we confirm it by
          phone.
        </p>
      </div>
      <div className="mt-12">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">
              Opening the reservation book…
            </p>
          }
        >
          <ReservationDesk />
        </Suspense>
      </div>
    </main>
  )
}
