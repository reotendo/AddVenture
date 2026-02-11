"use client";

import { Home, BookOpen, Plus, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", icon: Home },
    { href: "/daily/feed", icon: BookOpen },
    { href: "/create", icon: Plus },
    { href: "/notifications", icon: Bell },
    { href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md
      -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
      <div className="flex justify-around py-3">
        {items.map(({ href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <Icon
                className={`h-6 w-6 ${
                  active ? "text-black" : "text-gray-400"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
