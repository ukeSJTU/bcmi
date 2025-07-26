import type { Nav } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import Link from "next/link"
import { getPayload } from "payload"
import { SiteHeaderClient } from "./site-header-client"

interface NavigationItem {
  label: string
  href: string
  openInNewTab?: boolean
}

// TODO: use seed data to populate initial data on deployment
const defaultNavigationItems: NavigationItem[] = [
  { label: "About", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Members", href: "/members" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
]

async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const payload = await getPayload({ config })
    const nav: Nav = await payload.findGlobal({
      slug: 'nav',
    })
    if (nav.items && Array.isArray(nav.items) && nav.items.length > 0) {
      return nav.items.map((item: Nav['items'][0]) => ({
        label: item.label,
        href: item.href,
        openInNewTab: item.newTab || false
      }))
    } else {
      return defaultNavigationItems
    }
  } catch (error) {
    console.error('Failed to fetch navigation:', error)
    // Fallback to default items
    return defaultNavigationItems
  }
}

export async function SiteHeader() {
  const navigationItems = await getNavigationItems()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/bcmi.logo.small.png"
            alt="BCMI Logo"
            width={60}
            height={60}
            className="h-12 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">BCMI</span>
            <span className="text-sm text-muted-foreground">
              Brain-like Computing & Machine Intelligence
            </span>
          </div>
        </Link>

        <SiteHeaderClient navigationItems={navigationItems} />
      </div>
    </header>
  )
}
