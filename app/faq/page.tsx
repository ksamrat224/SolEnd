"use client";

import Link from "next/link";


const FAQS = [
  {
    question: "How is my risk score calculated?",
    answer:
      "The score is based on public wallet activity such as age, transaction history, balance, and repayment behavior. It helps the backend suggest loan terms, but the actual funds still move through the on-chain program.",
  },
  {
    question: "Is my collateral safe?",
    answer:
      "Collateral is managed by the Solana program rather than by a person. That means the rules for locking and releasing it are encoded in the contract and executed only when the transaction conditions are met.",
  },
  {
    question: "What happens if I do not repay?",
    answer:
      "If a loan goes overdue, the protocol can move into liquidation according to its program rules. The exact outcome depends on the loan state and repayment window stored on chain.",
  },
  {
    question: "Is this a real bank?",
    answer:
      "No. SolLend is a decentralized lending product. There is no bank account, no branch, and no traditional underwriter. Users connect a wallet and interact with the protocol directly.",
  },
  {
    question: "Why should I trust the product?",
    answer:
      "The product is designed around transparent on-chain logic, a clear risk model, and a minimal backend that coordinates scoring rather than holding user funds.",
  },
  {
    question: "What is SolLend trying to become?",
    answer:
      "It starts as a simple peer-to-pool lending app and is structured to expand into a broader credit platform with better dashboards, more loan types, and stronger support content.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex-1 bg-background text-foreground">
      

      <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-10 md:px-6">
        <section className="rounded-3xl border border-border bg-card p-8 md:p-12">
          <p className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            FAQ
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Answers for new users and future users.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            This page explains the protocol in plain language so the product is
            easy to understand before a user ever opens the borrow flow.
          </p>

          <div className="mt-8 space-y-3">
            {FAQS.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-background p-5 transition-colors open:bg-secondary/30"
              >
                <summary className="cursor-pointer list-none text-[15px] font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <span className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-[15px]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Learn About SolLend
            </Link>
            <Link
              href="/borrow"
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Start Borrowing
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}