import type { Metadata } from "next"
import { Suspense } from "react"
import { ReservationDesk } from "@/components/reservation-desk"
import { restaurant } from "@/lib/restaurant"

export const metadata: Metadata = {
  title: "Reserve a table",
  description:
    "Request a table at Shanghai Shikumen Fine Cuisine. Parties of one to eight, Tuesday through Sunday.",
}

export default function ReservePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
          Reservations
        </p>
        <h1 className="mt-3 font-heading text-5xl tracking-tight sm:text-6xl">
          A table on Lane 48
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Parties of one to {restaurant.maxParty}. Monday the gate is shut. For
          a private room or a larger table, call{" "}
          <a
            href={restaurant.phoneHref}
            className="text-foreground underline-offset-4 hover:underline"
          >
            {restaurant.phone}
          </a>
          . A request made here is saved in this browser, and the house confirms
          it by phone.
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
