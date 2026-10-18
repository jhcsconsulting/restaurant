import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { courses, dishes, formatPrice } from "@/lib/restaurant"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Cold dishes, soup dumplings, red-braised pork, and scallion oil noodles at Shanghai Shikumen Fine Cuisine.",
}

export default function MenuPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
          The table
        </p>
        <h1 className="mt-3 font-heading text-5xl tracking-tight sm:text-6xl">
          What we cook
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          A short menu, written for the house rather than a survey of China.
          Prices are per plate, in yuan. The market moves a dish now and then;
          the red-braised pork does not.
        </p>
      </div>

      <nav aria-label="Courses" className="mt-8 flex flex-wrap gap-2">
        {courses.map((course) => (
          <a
            key={course}
            href={`#${course.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            {course}
          </a>
        ))}
      </nav>

      <div className="mt-14 space-y-20">
        {courses.map((course) => {
          const items = dishes.filter((dish) => dish.course === course)
          const courseId = course.toLowerCase().replace(/[^a-z]+/g, "-")
          return (
            <section key={course} id={courseId} className="scroll-mt-24">
              <h2 className="font-heading text-3xl tracking-tight">{course}</h2>
              <ul className="mt-8 space-y-14">
                {items.map((dish, index) => (
                  <li
                    key={dish.slug}
                    className="grid items-center gap-6 md:grid-cols-2 md:gap-10"
                  >
                    <div
                      className={cn(
                        "relative aspect-[4/3] overflow-hidden rounded-xl bg-muted",
                        index % 2 === 1 && "md:order-2"
                      )}
                    >
                      <Image
                        src={dish.image}
                        alt={dish.alt}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                        {dish.portion}
                        {dish.signature ? " · House signature" : ""}
                      </p>
                      <h3 className="mt-2 font-heading text-3xl tracking-tight">
                        {dish.english}
                      </h3>
                      <p lang="zh" className="mt-1 text-cinnabar">
                        {dish.chinese}
                      </p>
                      <p className="mt-4 leading-7 text-muted-foreground">
                        {dish.description}
                      </p>
                      <p className="mt-4 text-lg">{formatPrice(dish.price)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <aside className="mt-20 rounded-2xl bg-lacquer px-6 py-10 text-paper sm:px-10">
        <h2 className="font-heading text-3xl tracking-tight">
          Hungry is a reason to book
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-paper/75">
          The dining room seats a few dozen. If you already know you want the
          pork and the dumplings, hold a table before you come down the lane.
        </p>
        <Link
          href="/reserve"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 px-5")}
        >
          Reserve a table
        </Link>
      </aside>
    </main>
  )
}
