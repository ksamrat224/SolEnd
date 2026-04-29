"use client";

import Link from "next/link";

import { WalletButton } from "./components/wallet-button";
import { useWallet } from "./lib/wallet/context";

const FEATURES = [
  {
    title: "Risk-Based Scoring",
    description:
      "Borrowing limits and rates are based on your on-chain track record, not paperwork.",
  },
  {
    title: "Instant Disbursement",
    description:
      "Approved loans are funded straight from pool liquidity once your transaction is confirmed.",
  },
  {
    title: "On-Chain Collateral",
    description:
      "Collateral stays in deterministic program vaults and follows transparent liquidation rules.",
  },
];

export default function HomePage() {
  const { status } = useWallet();
  const isConnected = status === "connected";

  return (
    <div className="flex-1 bg-background text-foreground">
      

      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-20 pt-12 md:px-6 md:pt-20">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-secondary/80 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Solana Devnet
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Borrow SOL. No bank. No KYC.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              Connect your Phantom wallet and get a loan based on your on-chain
              reputation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isConnected ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Go to Dashboard -&gt;
                </Link>
              ) : (
                <WalletButton
                  disconnectedLabel="Connect Wallet"
                  className="h-12 px-6 text-sm"
                />
              )}
              <Link
                href="/borrow"
                className="inline-flex h-12 items-center rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Explore Borrow Flow
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                What is SolLend?
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 rounded-2xl border border-border bg-background p-6 md:grid-cols-3 md:p-8">
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              What it does
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">
              Borrow and lend SOL with protocol rules instead of manual review.
            </h2>
          </article>
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Why trust it
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">
              Loans are backed by on-chain collateral and transparent program logic.
            </h2>
          </article>
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Where to learn more
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">
              Read the About page and FAQ for the product story and common questions.
            </h2>
          </article>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h2 className="text-lg font-medium">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
