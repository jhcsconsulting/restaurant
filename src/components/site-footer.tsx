import Link from "next/link"
import { hours, restaurant } from "@/lib/restaurant"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-lacquer text-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl tracking-tight">
            {restaurant.name}
          </p>
          <p className="mt-3 text-sm leading-6 text-paper/75">
            A dining room in a lane house. Benbang cooking, seated the way the
            house has always eaten: unhurried, and with the gate in sight.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-brass uppercase">Visit</p>
          <p className="mt-3 text-sm leading-6">
            {restaurant.lane}
            <br />
            {restaurant.district}
          </p>
          <a
            href={restaurant.phoneHref}
            className="mt-2 inline-block text-sm text-brass underline-offset-4 hover:underline"
          >
            {restaurant.phone}
          </a>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-brass uppercase">Hours</p>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {hours.map((row) => (
              <li key={row.label}>
                <span className="block text-paper">{row.label}</span>
                <span className="text-paper/70">{row.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Reservations made here stay in this browser and are confirmed by phone.</p>
          <Link href="/reserve" className="text-brass hover:underline">
            Request a table
          </Link>
        </div>
      </div>
    </footer>
  )
}
