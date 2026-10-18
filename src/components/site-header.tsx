"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

const links = [
  { href: "/story", label: "Story" },
  { href: "/menu", label: "Menu" },
  { href: "/reserve", label: "Reserve" },
] as const

function GateMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7">
      <path
        d="M5 13.5 16 5l11 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 13.5V27h16V13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M13.5 27v-8h5v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lacquer"
          onClick={() => setOpen(false)}
        >
          <GateMark />
          <span className="leading-tight">
            <span className="block font-heading text-lg tracking-tight">
              Shikumen
            </span>
            <span className="block text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">
              Fine cuisine
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm tracking-wide text-foreground/80 hover:text-foreground",
                  active && "text-cinnabar"
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/reserve"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}
          >
            Book a table
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-border px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-base",
                      active ? "bg-muted text-cinnabar" : "hover:bg-muted"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
