"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";
import { useWallet } from "../lib/wallet/context";
import { useBalance } from "../lib/hooks/use-balance";
import { lamportsToSolString } from "../lib/lamports";
import { isAdminWallet } from "../lib/admin";

const NAV_ITEMS = [
  { href: "/borrow", label: "Borrow" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lend", label: "Lend" },
];

const INFO_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

function getBackHref(pathname: string) {
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/lend") ||
    pathname.startsWith("/admin")
  ) {
    return "/borrow";
  }

  if (pathname.startsWith("/faq")) {
    return "/about";
  }

  return "/";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { wallet, status } = useWallet();
  const balance = useBalance(wallet?.account.address);
  const isAdmin = isAdminWallet(wallet?.account.address);
  const showBackButton = pathname !== "/";
  const activeInfoHref = INFO_ITEMS.find((item) => pathname === item.href)?.href;
  const navItems = isAdmin
    ? [...NAV_ITEMS, { href: "/admin", label: "Admin" }]
    : NAV_ITEMS;

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(getBackHref(pathname));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Go back"
              >
                <span aria-hidden="true">←</span>
                <span className="hidden sm:inline">Back</span>
              </button>
            ) : null}

            <Link
              href="/"
              className="text-base font-semibold tracking-tight transition-colors hover:text-primary"
            >
              SolLend
            </Link>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            {INFO_ITEMS.map((item) => {
              const isActive = activeInfoHref === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {status === "connected" && (
            <span className="hidden rounded-md border border-border px-2.5 py-1.5 font-mono text-xs tabular-nums text-muted-foreground md:inline-flex">
              {balance.lamports
                ? lamportsToSolString(balance.lamports, 4)
                : "0"}{" "}
              SOL
            </span>
          )}
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
