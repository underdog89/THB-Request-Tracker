"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ChevronDown, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Account } from "@prisma/client";

interface TopNavProps {
  accounts: Account[];
}

export function TopNav({ accounts }: TopNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Detect current account from path
  const currentSlug = pathname.split("/")[1];
  const currentAccount =
    currentSlug === "all"
      ? null
      : accounts.find((a) => a.slug === currentSlug);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-blue-600">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-semibold text-gray-900 text-sm">Request Tracker</span>
            </Link>

            {/* Account Switcher */}
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>{currentAccount?.name ?? "All Accounts"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {open && (
                <div className="absolute left-0 top-full mt-1 w-52 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                  <Link
                    href="/all"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm hover:bg-gray-50",
                      !currentAccount ? "text-blue-600 font-medium" : "text-gray-700"
                    )}
                  >
                    All Accounts
                  </Link>
                  <div className="border-t border-gray-100" />
                  {accounts.map((account) => (
                    <Link
                      key={account.id}
                      href={`/${account.slug}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm hover:bg-gray-50",
                        currentAccount?.id === account.id
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      )}
                    >
                      {account.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100" />
                  <Link
                    href="/accounts/new"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Account
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-4">
            {currentAccount && (
              <>
                <Link
                  href={`/${currentAccount.slug}/requests`}
                  className={cn(
                    "text-sm hover:text-blue-600",
                    pathname.includes("/requests") ? "text-blue-600 font-medium" : "text-gray-600"
                  )}
                >
                  Requests
                </Link>
                <Link
                  href={`/${currentAccount.slug}/settings`}
                  className={cn(
                    "text-sm hover:text-blue-600",
                    pathname.includes("/settings") ? "text-blue-600 font-medium" : "text-gray-600"
                  )}
                >
                  Settings
                </Link>
              </>
            )}
            {!currentAccount && currentSlug === "all" && (
              <Link
                href="/all/requests"
                className={cn(
                  "text-sm hover:text-blue-600",
                  pathname.includes("/requests") ? "text-blue-600 font-medium" : "text-gray-600"
                )}
              >
                Requests
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
