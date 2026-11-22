import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "See the food",
  description:
    "Soy sauce noodles, crab with rice cakes, and other Chinese dishes from the kitchen.",
}

const photos = [
  {
    src: "/photos/soy-sauce-noodles.jpg",
    english: "Soy sauce noodles",
    chinese: "酱油面",
    alt: "A white bowl of glossy amber soy sauce noodles topped with chopped scallion, chopsticks on the rim",
  },
  {
    src: "/photos/crab-rice-cakes.jpg",
    english: "Crab with rice cakes",
    chinese: "蟹粉年糕",
    alt: "Oval rice cakes in a glossy orange crab sauce, with crab meat, in a dark bowl beside a brass spoon",
  },
  {
    src: "/photos/xiaolongbao.jpg",
    english: "Soup dumplings",
    chinese: "小笼包",
    alt: "Soup dumplings in a bamboo steamer, one opened so the broth spills",
  },
  {
    src: "/photos/hongshao.jpg",
    english: "Red-braised pork belly",
    chinese: "红烧肉",
    alt: "Cubes of glossy red-braised pork belly in a shallow ceramic bowl",
  },
  {
    src: "/photos/shrimp.jpg",
    english: "Oil-exploded shrimp",
    chinese: "油爆虾",
    alt: "A heaped dish of pink-orange shrimp in their shells, glossy with oil",
  },
  {
    src: "/photos/shengjian.jpg",
    english: "Pan-fried pork buns",
    chinese: "生煎馒头",
    alt: "Steaming pan-fried buns in a black iron pan, sesame and scallion on top",
  },
  {
    src: "/photos/drunken-chicken.jpg",
    english: "Drunken chicken",
    chinese: "醉鸡",
    alt: "Pale slices of poached chicken in a clear jelly, scattered with goji berries",
  },
  {
    src: "/photos/smoked-fish.jpg",
    english: "Smoked fish",
    chinese: "熏鱼",
    alt: "Glossy pieces of soy-braised fish topped with white sesame seeds",
  },
] as const

export default function FoodPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-cinnabar uppercase">
          From the kitchen
        </p>
        <h1 className="mt-3 font-heading text-5xl tracking-tight sm:text-6xl">
          See the food
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Soy sauce noodles, crab with rice cakes, and other Chinese dishes
          the kitchen cooks. The head chef chooses the menu for the day and
          shows it to you before you come.
        </p>
      </div>

      <ul className="mt-12 grid gap-8 sm:grid-cols-2">
        {photos.map((photo) => (
          <li key={photo.src}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-heading text-2xl tracking-tight">
                  {photo.english}
                </p>
                <p lang="zh" className="text-sm text-cinnabar">
                  {photo.chinese}
                </p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <aside className="mt-16 rounded-2xl bg-lacquer px-6 py-10 text-paper sm:px-10">
        <h2 className="font-heading text-3xl tracking-tight">
          The menu is set with the chef
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-paper/75">
          These are the kinds of dishes he cooks. What is served on your day
          is the menu he shows you before you arrive.
        </p>
        <Link
          href="/menu"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 px-5")}
        >
          Read about the menu
        </Link>
      </aside>
    </main>
  )
}
