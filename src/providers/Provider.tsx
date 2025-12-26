"use client";
import { UserProvider } from "@/context/UserContext";
import React from "react";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};
