"use client";

import Link from "next/link";


const HIGHLIGHTS = [
  {
    title: "Risk-based lending",
    description:
      "We score a wallet from its on-chain history to shape loan size, duration, and interest instead of relying on paper credit files.",
  },
  {
    title: "Collateral stays on chain",
    description:
      "Borrowed funds and collateral movement are handled through the Anchor program, so the protocol rules are visible and enforceable on Solana.",
  },
  {
    title: "Built for expansion",
    description:
      "SolLend starts with borrowing, lending, and repayment, but the product is structured to grow into a broader credit and liquidity platform.",
  },
];

const FLOW = [
  "Connect a wallet.",
  "We read public on-chain activity and generate a risk score.",
  "The score sets your lending terms and collateral requirements.",
  "If approved, the loan is disbursed from the pool and tracked on chain.",
];

export default function AboutPage() {
  return (
    <div className="flex-1 bg-background text-foreground">
      

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-12">
          <p className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            What is SolLend?
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            A peer-to-pool lending product for users with on-chain history.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            SolLend lets borrowers unlock SOL loans with on-chain reputation,
            collateral, and transparent protocol rules. It is designed as a
            startup product that can grow from a focused MVP into a broader
            credit platform without redesigning the core experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/borrow"
              className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Try Borrow Flow
            </Link>
            <Link
              href="/faq"
              className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Read the FAQ
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h2 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </p>
            <div className="mt-5 space-y-4">
              {FLOW.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-2xl border border-border/70 bg-background p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-foreground md:text-[15px]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Why this exists
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground md:text-[15px]">
              <p>
                Most lending apps feel like dashboards first and products second.
                SolLend is being shaped to feel like a real startup: clear
                positioning, simple navigation, and enough trust-building
                context for someone to understand the system quickly.
              </p>
              <p>
                The initial focus is micro-lending on Solana, but the layout,
                routing, and information architecture are set up so the product
                can expand into additional credit flows, pool management, and
                support content later.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}