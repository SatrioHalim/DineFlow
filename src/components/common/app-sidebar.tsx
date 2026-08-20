"use client";
import { EllipsisVertical, LogOut, Utensils } from "lucide-react";
import {
  Sidebar,
  SidebarFooter,
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

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  return (
    <Sidebar>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
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
