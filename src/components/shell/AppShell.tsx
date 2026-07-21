"use client";

import { GlobalHeader } from "./GlobalHeader";
import { StatusBar } from "./StatusBar";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = ["/dashboard", "/market", "/settings"].some((p) => pathname.startsWith(p))
    ? false
    : true;
  const isLanding = pathname === "/";

  if (isLanding) return <>{children}</>;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <GlobalHeader />
      <main className="flex-1 overflow-hidden">{children}</main>
      <StatusBar />
    </div>
  );
}
