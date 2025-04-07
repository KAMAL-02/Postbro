"use client"

import { Calendar, Home, Inbox, Search, Settings, Link2, Globe, Hexagon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"

const items = [
  { title: "Rest", url: "/", icon: Link2 },
  { title: "Realtime", url: "/realtime", icon: Globe },
  { title: "GraphQL", url: "/graphql", icon: Hexagon },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-none h-auto mt-11">
      <SidebarContent className="bg-[#282828] text-[#fff]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu >
              <TooltipProvider delayDuration={800} skipDelayDuration={500}>
              {items.map((item) => {
                  const isActive = pathname === item.url;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`flex items-center gap-3 p-2 rounded-md transition-all
                            ${isActive ? "bg-[rgba(207,104,21,0.3)] text-[#df894c]" : ""} 
                            `}
                        >
                          { open ? (
                             <>
                             <item.icon className="w-4 h-4" />
                             <span>{item.title}</span>
                           </>
                          ) : (
                            <Tooltip>
                            <TooltipTrigger>
                              <item.icon className="w-4 h-4 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center" className="text-[#df894c] text-sm">{item.title}</TooltipContent>
                          </Tooltip>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto cursor-pointer">
          <TooltipProvider delayDuration={800} skipDelayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
              <SidebarTrigger className=""/>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" className="text-[#df894c] text-sm">Expand Sidebar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
