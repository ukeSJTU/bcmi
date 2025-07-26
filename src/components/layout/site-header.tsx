"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

const navigationItems = [
  { label: "About", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Members", href: "/members" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo and site title */}
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

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link href={item.href} className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="/bcmi.logo.small.png"
                  alt="BCMI Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
                <div className="flex flex-col">
                  <span className="font-bold">BCMI</span>
                  <span className="text-xs text-muted-foreground">
                    Brain-like Computing & Machine Intelligence
                  </span>
                </div>
              </div>
              
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}