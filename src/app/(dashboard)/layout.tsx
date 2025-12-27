import React from "react";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import RoleBaseDashboardGererate from "@/sheared/RoleBaseDashboardGererate";
import DashBoardNavigator from "@/sheared/DashBoardNavigator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {<RoleBaseDashboardGererate></RoleBaseDashboardGererate>}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashBoardNavigator></DashBoardNavigator>
          </div>
        </header>
        <div className="">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
