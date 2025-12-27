"use client";

import { AdminAppSideBar } from "@/app/(dashboard)/(adminDashboard)/admin/_AdminAppSideBar";
import { UserAppSideBar } from "@/app/(dashboard)/(userDashboard)/user/_UserAppSideBar";
import { useUser } from "@/context/UserContext";

export default function RoleBaseDashboardGererate() {
  const { user } = useUser();
  console.log(user);

  return (
    <div>
      {user && user?.role === "admin" && <AdminAppSideBar></AdminAppSideBar>}

      {user && user?.role === "user" && <UserAppSideBar></UserAppSideBar>}
    </div>
  );
}
