import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { restaurant } from "@/lib/restaurant"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "Story",
  description:
    "How Shanghainese cooking found a dining room in Richmond Hill, Ontario.",
}

export default function StoryPage() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl items-end gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
            The house
          </p>
          <h1 className="mt-3 font-heading text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            A stone gate, then a kitchen
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Shanghai Shikumen Fine Cuisine cooks in Richmond Hill, Ontario. The
            food is benbang — soy, sugar, vinegar, and wine — and the room is
            there for a long meal.
          </p>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          <Image
            src="/photos/shikumen-lane.jpg"
            alt="Dusk in a narrow Shanghai lane, wet paving stones reflecting warm windows between brick shikumen gates"
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-12">
          <h2 className="font-heading text-3xl tracking-tight md:col-span-4 md:text-4xl">
            What a shikumen is
          </h2>
          <div className="space-y-5 text-base leading-8 text-muted-foreground md:col-span-8">
            <p>
              The word means stone warehouse gate. From the 1860s through the
              1930s, Shanghai filled its concessions with lilong: tight lanes of
              terrace houses that borrowed a Jiangnan courtyard and a European
              row. The gate was stone, the doors were wood, and a family lived
              behind both.
            </p>
            <p>
              The name comes from that gate. The dining room is in Richmond
              Hill, Ontario, and the cooking follows the same register: soy,
              sugar, vinegar, and time. Guests sit down to a long meal. There
              is no lobby.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted md:order-2">
          <Image
            src="/photos/hero-dining.jpg"
            alt="Paper lanterns over dark wood tables set with celadon bowls in the dining room"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-heading text-3xl tracking-tight md:text-4xl">
            How the kitchen cooks
          </h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              Benbang cai is the food of Shanghai, not a tour of every region.
              Red-braising does the heavy work. Pork belly goes into soy, rock
              sugar, and Shaoxing in the morning and is not touched for show.
              The smoked fish is fried, then sweetened until it shines. The
              drunken chicken cools in wine until the jelly sets.
            </p>
            <p>
              Dumplings are a separate discipline. The soup inside a xiaolongbao
              is stock, reduced and jellied, then melted again by steam. If the
              wrapper breaks in the steamer, it does not leave the kitchen.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-heading text-3xl tracking-tight md:text-4xl">
            A day in the kitchen
          </h2>
          <ol className="mt-8 space-y-8">
            <li>
              <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
                Morning
              </p>
              <p className="mt-2 leading-7 text-muted-foreground">
                Stock for the dumplings, a fresh pot of scallion oil, and the
                belly into the braise. The kitchen is still quiet enough to hear
                the steamer lids.
              </p>
            </li>
            <li>
              <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
                Afternoon
              </p>
              <p className="mt-2 leading-7 text-muted-foreground">
                Lunch service is short. Between sittings the rice cakes are
                soaked, the shrimp are sorted by size, and someone walks the
                room to reset the celadon.
              </p>
            </li>
            <li>
              <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
                Evening
              </p>
              <p className="mt-2 leading-7 text-muted-foreground">
                The lanterns go on before the first seating. Tables turn once,
                sometimes twice. At the end of service the room goes quiet and
                the lights go down.
              </p>
            </li>
          </ol>
          <p className="mt-10 leading-7">
            {restaurant.city}, {restaurant.region}.{" "}
            <a
              href={restaurant.phoneHref}
              className="text-cinnabar underline-offset-4 hover:underline"
            >
              {restaurant.phone}
            </a>
          </p>
          <Link
            href="/reserve"
            className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-5")}
          >
            Reserve a table
          </Link>
        </div>
      </section>
    </main>
  )
}
