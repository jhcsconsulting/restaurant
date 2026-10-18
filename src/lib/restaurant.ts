export const restaurant = {
  name: "Shanghai Shikumen Fine Cuisine",
  shortName: "Shikumen",
  lane: "Lane 48, Sinan Road",
  district: "Huangpu, Shanghai",
  phone: "+86 21 5388 1948",
  phoneHref: "tel:+862153881948",
  holdMinutes: 15,
  maxParty: 8,
  bookingWindowDays: 90,
}

export const hours = [
  {
    label: "Tuesday – Friday",
    detail: "Lunch 11:30–14:30 · Dinner 17:30–21:00",
  },
  {
    label: "Saturday – Sunday",
    detail: "Lunch 11:00–14:30 · Dinner 17:00–21:30",
  },
  {
    label: "Monday",
    detail: "The gate is shut",
  },
] as const

export type MenuCourse = "Cold" | "Dumplings" | "Braised & fried" | "Noodles"

export type Dish = {
  slug: string
  english: string
  chinese: string
  course: MenuCourse
  price: number
  portion: string
  description: string
  image: string
  alt: string
  signature?: boolean
}

export const dishes: Dish[] = [
  {
    slug: "drunken-chicken",
    english: "Drunken chicken",
    chinese: "醉鸡",
    course: "Cold",
    price: 78,
    portion: "Half bird",
    description:
      "Poached just to the bone, then cooled overnight in Shaoxing. It arrives in its own jelly, with a few goji berries for color.",
    image: "/photos/drunken-chicken.jpg",
    alt: "Pale slices of poached chicken in a clear jelly on a celadon plate, scattered with goji berries",
  },
  {
    slug: "smoked-fish",
    english: "Smoked fish",
    chinese: "熏鱼",
    course: "Cold",
    price: 62,
    portion: "To share",
    description:
      "Yellow croaker, fried, then bathed in soy and sugar until the surface lacquered. Sweet first, then a clean salt. Sesame on top.",
    image: "/photos/smoked-fish.jpg",
    alt: "Thick glossy pieces of soy-braised fish topped with white sesame seeds",
  },
  {
    slug: "xiaolongbao",
    english: "Soup dumplings",
    chinese: "小笼包",
    course: "Dumplings",
    price: 68,
    portion: "Eight pieces",
    description:
      "Thin wrappers, a tight pleat, and a spoon of pork broth that should still be hot when you bite. Vinegar and ginger threads on the side — not a pool of sauce.",
    image: "/photos/xiaolongbao.jpg",
    alt: "Six soup dumplings in a bamboo steamer, one torn open so the broth spills onto the paper",
    signature: true,
  },
  {
    slug: "shengjian",
    english: "Pan-fried pork buns",
    chinese: "生煎馒头",
    course: "Dumplings",
    price: 48,
    portion: "Four pieces",
    description:
      "Crisp on the bottom, soft on the crown, sesame and scallion while they are still spitting. Eat them before the crust gives up.",
    image: "/photos/shengjian.jpg",
    alt: "Four steaming pan-fried buns in a black iron pan, sesame and scallion on top",
    signature: true,
  },
  {
    slug: "hongshao-rou",
    english: "Red-braised pork belly",
    chinese: "红烧肉",
    course: "Braised & fried",
    price: 98,
    portion: "For the table",
    description:
      "Cubes of belly, skin on, braised from morning in soy, rock sugar, and Shaoxing. The sauce should coat a spoon and stop there.",
    image: "/photos/hongshao.jpg",
    alt: "Cubes of glossy red-braised pork belly in a shallow ceramic bowl beside a brass spoon",
    signature: true,
  },
  {
    slug: "oil-shrimp",
    english: "Oil-exploded shrimp",
    chinese: "油爆虾",
    course: "Braised & fried",
    price: 128,
    portion: "River shrimp",
    description:
      "Small river shrimp, shells left on, shocked in hot oil and finished with soy, sugar, and a little vinegar. Heads are for sucking.",
    image: "/photos/shrimp.jpg",
    alt: "A heaped metal dish of pink-orange river shrimp in their shells, glossy with oil",
  },
  {
    slug: "scallion-noodles",
    english: "Scallion oil noodles",
    chinese: "葱油拌面",
    course: "Noodles",
    price: 42,
    portion: "One bowl",
    description:
      "Springy wheat noodles dressed in scallion oil, nothing else competing. The fried scallion should be dark, not bitter.",
    image: "/photos/scallion-noodles.jpg",
    alt: "A white bowl of glossy wheat noodles piled with dark fried scallion, chopsticks on the rim",
    signature: true,
  },
  {
    slug: "rice-cakes",
    english: "Stir-fried rice cakes",
    chinese: "炒年糕",
    course: "Noodles",
    price: 58,
    portion: "With pork",
    description:
      "Oval slices of nian gao, pork, and cabbage, fried until the edges catch and the centers stay chewy. A winter habit we keep all year.",
    image: "/photos/rice-cakes.jpg",
    alt: "Stir-fried oval rice cakes with pork and cabbage in a black wok",
  },
]

export const courses: MenuCourse[] = [
  "Cold",
  "Dumplings",
  "Braised & fried",
  "Noodles",
]

export type Seating = {
  value: string
  service: "Lunch" | "Dinner"
}

const weekdaySeatings: Seating[] = [
  { value: "11:30", service: "Lunch" },
  { value: "12:00", service: "Lunch" },
  { value: "12:30", service: "Lunch" },
  { value: "13:00", service: "Lunch" },
  { value: "13:30", service: "Lunch" },
  { value: "14:00", service: "Lunch" },
  { value: "17:30", service: "Dinner" },
  { value: "18:00", service: "Dinner" },
  { value: "18:30", service: "Dinner" },
  { value: "19:00", service: "Dinner" },
  { value: "19:30", service: "Dinner" },
  { value: "20:00", service: "Dinner" },
  { value: "20:30", service: "Dinner" },
  { value: "21:00", service: "Dinner" },
]

const weekendSeatings: Seating[] = [
  { value: "11:00", service: "Lunch" },
  { value: "11:30", service: "Lunch" },
  { value: "12:00", service: "Lunch" },
  { value: "12:30", service: "Lunch" },
  { value: "13:00", service: "Lunch" },
  { value: "13:30", service: "Lunch" },
  { value: "14:00", service: "Lunch" },
  { value: "14:30", service: "Lunch" },
  { value: "17:00", service: "Dinner" },
  { value: "17:30", service: "Dinner" },
  { value: "18:00", service: "Dinner" },
  { value: "18:30", service: "Dinner" },
  { value: "19:00", service: "Dinner" },
  { value: "19:30", service: "Dinner" },
  { value: "20:00", service: "Dinner" },
  { value: "20:30", service: "Dinner" },
  { value: "21:00", service: "Dinner" },
  { value: "21:30", service: "Dinner" },
]

export function toISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function parseISODate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function isMonday(date: Date) {
  return date.getDay() === 1
}

export function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function seatingsFor(date: Date) {
  return isWeekend(date) ? weekendSeatings : weekdaySeatings
}

export function formatLongDate(value: string) {
  const date = parseISODate(value)
  if (!date) return value
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatPrice(price: number) {
  return `¥${price}`
}
