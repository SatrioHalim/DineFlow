"use client";
import { EllipsisVertical, LogOut, Utensils } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
} from "@/constants/sidebar-constant";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const profile = {
    name: "Dev Testing",
    role: "admin",
    avatar_url: "",
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={"lg"}
              render={
                <div className="font-semibold flex items-center gap-2">
                  <div className="bg-teal-500 flex p-2 items-center justify-center rounded-md">
                    <Utensils className="size-4" />
                  </div>
                  DineFlow
                </div>
              }
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.map(
                (item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={
                        <a
                          href={item.url}
                          className={cn("px-4 py-3 h-auto", {
                            "bg-teal-500 text-white hover:bg-teal-500 hover:text-white":
                              pathname === item.url,
                          })}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </a>
                      }
                    ></SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className={"h-8 w-8 rounded-lg"}>
                  <AvatarImage src={""} alt=""></AvatarImage>
                  <AvatarFallback className={"rounded-lg"}>A</AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <h4 className="truncate font-medium">Dev Testing</h4>
                  <p className="text-muted-foreground truncate text-xs">
                    Admin
                  </p>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className={"min-w-56 rounded-lg"}
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className={"p-0 font-normal"}>
                    <div className="flex items-center gap-2 px-1 py-1.5">
                      <Avatar className={"h-8 w-8 rounded-lg"}>
                        <AvatarImage src={""} alt=""></AvatarImage>
                        <AvatarFallback className={"rounded-lg"}>
                          A
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <h4 className="truncate font-medium">Dev Testing</h4>
                        <p className="text-muted-foreground truncate text-xs">
                          Admin
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <LogOut></LogOut>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
