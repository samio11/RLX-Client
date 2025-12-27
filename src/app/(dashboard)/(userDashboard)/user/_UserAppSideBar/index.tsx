"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "lucide-react";
import { logoutUser } from "@/services/user";
import { Button } from "@/components/ui/button";

// This is sample data.
const data = {
  navMain: [
    {
      title: "User",
      url: "/user/dashboard",
      items: [
        {
          title: "User Dashboard",
          url: "/user/dashboard",
        },
      ],
    },
    {
      title: "Back Home",
      url: "/",
    },
  ],
};

export function UserAppSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const path = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (err) {
      throw err;
    }
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <User className="size-6"></User>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">RLX</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={item.url === path}
                        >
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
            <Button onClick={() => handleLogout()}>Logout</Button>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
