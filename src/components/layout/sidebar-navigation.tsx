"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarItem {
  title: string
  href?: string
  anchor?: string
  active?: boolean
}

interface SidebarNavigationProps {
  title: string
  items: SidebarItem[]
  className?: string
}

export function SidebarNavigation({ title, items, className }: SidebarNavigationProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-muted-foreground">
            {title}
          </h2>
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={index}>
                {item.href || item.anchor ? (
                  <Link href={item.href || `#${item.anchor}`}>
                    <Button
                      variant={item.active || pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.title}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className="w-full justify-start cursor-default"
                    disabled={!item.href && !item.anchor}
                  >
                    {item.title}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Predefined sidebar configurations for different pages
export const sidebarConfigs = {
  research: {
    title: "RESEARCH TOPICS",
    items: [
      { title: "Brain Computer Interface and EEG Data Processing", active: true },
      { title: "Computer Vision" },
      { title: "Speech Recognition" },
      { title: "Natural Language Processing" },
    ]
  },
  members: {
    title: "MEMBERS IN BCMI",
    items: [
      { title: "Faculty Members", active: true },
      { title: "Postdoctor and PhD. Students" },
      { title: "Graduate Students" },
      { title: "Undergraduate Students" },
      { title: "Alumni/Alumnae" },
    ]
  },
  events: {
    title: "EVENTS",
    items: [
      { title: "Upcoming Events", active: true },
      { title: "Coming Conference" },
      { title: "Past Events" },
    ]
  },
  resources: {
    title: "RESOURCES",
    items: [
      { title: "Data sets", active: true },
      { title: "Tutorials & Courses" },
      { title: "Design Resources" },
      { title: "Links" },
    ]
  }
}