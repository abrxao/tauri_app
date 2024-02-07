"use client";
import { useIsClient } from "@/hooks/useIsClient";
import UsersTable_ from "./component";
export default function UsersTable() {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <UsersTable_ />;
}
