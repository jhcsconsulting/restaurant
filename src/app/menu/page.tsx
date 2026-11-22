import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { restaurant } from "@/lib/restaurant"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The head chef shows the menu he can cook before you arrive. 120 CAD per person, with exceptions for children.",
}

export default function MenuPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
          The table
        </p>
        <h1 className="mt-3 font-heading text-5xl tracking-tight sm:text-6xl">
          The menu comes before you do
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          There is no fixed list of dishes. Before you come to the restaurant,
          the head chef will show you the menu he can cook that day.
        </p>
      </div>

      <section className="mt-12 max-w-2xl rounded-2xl border border-border bg-card px-6 py-8 sm:px-10">
        <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
          The price
        </p>
        <p className="mt-3 font-heading text-5xl tracking-tight">
          {restaurant.pricePerPersonCad} CAD
          <span className="ml-2 font-sans text-lg font-normal text-muted-foreground">
            per person
          </span>
        </p>
        <p className="mt-4 leading-7 text-muted-foreground">
          Children are the exception. Ask the house when you reserve, and the
          chef will say what applies.
        </p>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/reserve"
          className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
        >
          Reserve a table
        </Link>
        <Link
          href="/food"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 px-5"
          )}
        >
          See the food
        </Link>
      </div>
    </main>
  )
}
