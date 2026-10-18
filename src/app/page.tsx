import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { dishes, formatPrice, hours, restaurant } from "@/lib/restaurant"
import { cn } from "cn"

const signatures = dishes.filter((dish) => dish.signature).slice(0, 3)

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[78vh] bg-lacquer">
        <Image
          src="/photos/hero-dining.jpg"
          alt="A quiet dining room with paper lanterns, dark wood tables, and celadon bowls set for service"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lacquer via-lacquer/55 to-lacquer/15" />
        <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-end px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs tracking-[0.22em] text-brass uppercase">
            Huangpu · Lane 48
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-5xl leading-[0.95] tracking-tight text-paper sm:text-7xl">
            Shanghai Shikumen Fine Cuisine
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-paper/85 sm:text-lg">
            Soup dumplings with a real broth, pork belly that has been braising
            since morning, and a table in a lane house that still has its stone
            gate.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/reserve"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 px-5 text-sm"
              )}
            >
              Reserve a table
            </Link>
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-paper/30 bg-transparent px-5 text-sm text-paper hover:bg-paper/10 hover:text-paper"
              )}
            >
              See the food
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <dl className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div>
            <dt className="text-xs tracking-[0.18em] text-cinnabar uppercase">
              Address
            </dt>
            <dd className="mt-2 text-lg leading-7">
              {restaurant.lane}
              <br />
              {restaurant.district}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.18em] text-cinnabar uppercase">
              Hours
            </dt>
            <dd className="mt-2 space-y-2 text-sm leading-6">
              {hours.map((row) => (
                <p key={row.label}>
                  <span className="block font-medium">{row.label}</span>
                  <span className="text-muted-foreground">{row.detail}</span>
                </p>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.18em] text-cinnabar uppercase">
              The kitchen
            </dt>
            <dd className="mt-2 text-sm leading-7 text-muted-foreground">
              Benbang cooking: soy, sugar, Shaoxing, and time. Call{" "}
              <a
                href={restaurant.phoneHref}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {restaurant.phone}
              </a>{" "}
              for parties larger than eight.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
              From the pass
            </p>
            <h2 className="mt-2 font-heading text-4xl tracking-tight sm:text-5xl">
              What the kitchen is known for
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm text-cinnabar underline-offset-4 hover:underline"
          >
            The full menu
          </Link>
        </div>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {signatures.map((dish) => (
            <li key={dish.slug}>
              <article className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={dish.image}
                    alt={dish.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-2xl tracking-tight">
                    {dish.english}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(dish.price)}
                  </p>
                </div>
                <p lang="zh" className="text-sm text-cinnabar">
                  {dish.chinese}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {dish.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-secondary/70">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
            <Image
              src="/photos/shikumen-lane.jpg"
              alt="A wet stone lane at dusk, grey brick shikumen gates, and laundry strung between the houses"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
              The house
            </p>
            <h2 className="mt-2 font-heading text-4xl tracking-tight sm:text-5xl">
              The lane comes first
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Shikumen means stone gate. The frame on Lane 48 is still the
              original, and the ground floor is the dining room. Upstairs, the
              pork belly braises with the windows cracked so the lane smells
              like soy by late afternoon.
            </p>
            <Link
              href="/story"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-8 h-11 px-5"
              )}
            >
              Read the story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-2xl bg-lacquer px-6 py-12 text-paper sm:px-12">
          <p className="text-xs tracking-[0.18em] text-brass uppercase">
            A seat
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-4xl tracking-tight sm:text-5xl">
            Tell us when you are coming
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-paper/75">
            Tuesday through Sunday, parties of one to eight. The request stays
            on this device, and the house confirms by phone. Mondays the gate
            stays shut.
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
