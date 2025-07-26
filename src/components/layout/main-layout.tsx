import { ReactNode } from "react"
import { SidebarNavigation, sidebarConfigs } from "./sidebar-navigation"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: ReactNode
  sidebar?: keyof typeof sidebarConfigs | null
  className?: string
}

export function MainLayout({ children, sidebar, className }: MainLayoutProps) {
  const hasSidebar = sidebar && sidebarConfigs[sidebar]
  
  return (
    <div className={cn("min-h-screen", className)}>
      <div className="container mx-auto px-4 py-8">
        {hasSidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - hidden on mobile, visible on desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <SidebarNavigation
                  title={sidebarConfigs[sidebar].title}
                  items={sidebarConfigs[sidebar].items}
                />
              </div>
            </aside>
            
            {/* Main content */}
            <main className="lg:col-span-3">
              {/* Mobile sidebar - collapsible */}
              <div className="block lg:hidden mb-8">
                <SidebarNavigation
                  title={sidebarConfigs[sidebar].title}
                  items={sidebarConfigs[sidebar].items}
                  className="border rounded-lg p-4"
                />
              </div>
              
              {children}
            </main>
          </div>
        ) : (
          // Full width layout for homepage
          <main className="w-full">
            {children}
          </main>
        )}
      </div>
    </div>
  )
}