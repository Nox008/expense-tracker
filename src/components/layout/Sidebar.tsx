// components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Settings, Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col border-r bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Wallet className="h-6 w-6 text-emerald-500" />
          <span>ExpenseTracker</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                  pathname === item.href
                    ? "bg-zinc-200 dark:bg-zinc-800 font-semibold"
                    : ""
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <ThemeToggle />
      </div>
    </aside>
  );
}