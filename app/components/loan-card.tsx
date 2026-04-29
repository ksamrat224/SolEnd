"use client";

import { useMemo } from "react";
import type { LoanRecord } from "../lib/api";

type LoanCardProps = {
  loan: LoanRecord;
};

const LAMPORTS_PER_SOL = 1_000_000_000;

function lamportsStringToSol(value: string): string {
  const numeric = Number(value) / LAMPORTS_PER_SOL;
  return numeric.toLocaleString(undefined, {
    minimumFractionDigits: numeric < 1 ? 4 : 2,
    maximumFractionDigits: 4,
  });
}

function formatCountdown(dueTimestamp: number): string {
  const delta = dueTimestamp - Math.floor(Date.now() / 1000);

  if (delta <= 0) {
    return "Overdue";
  }

  const days = Math.floor(delta / 86400);
  const hours = Math.floor((delta % 86400) / 3600);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  const minutes = Math.floor((delta % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function LoanCard({ loan }: LoanCardProps) {
  const dueTimestamp = Number(loan.dueTimestamp);
  const overdue = loan.status === "ACTIVE" && dueTimestamp < Date.now() / 1000;

  const countdown = useMemo(
    () => formatCountdown(dueTimestamp),
    [dueTimestamp]
  );

  return (
    <article className="posthog-card p-5 bg-[#fdfdf8] transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
            Loan
          </p>
          <p className="mt-1 font-mono text-[24px] font-bold tabular-nums text-primary leading-none">
            {lamportsStringToSol(loan.loanAmountLamports)} <span className="text-[14px]">SOL</span>
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-bold ${
            overdue
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-[#bfc1b7] bg-[#eeefe9] text-primary"
          }`}
        >
          {overdue ? "Overdue" : loan.status}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-[14px] bg-[#eeefe9]/50 p-4 rounded-[4px] border border-[#bfc1b7]">
        <div>
          <dt className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Collateral</dt>
          <dd className="font-mono font-bold tabular-nums text-foreground">
            {lamportsStringToSol(loan.collateralAmountLamports)} SOL
          </dd>
        </div>
        <div>
          <dt className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Due In</dt>
          <dd className={`font-bold ${overdue ? "text-destructive" : "text-foreground"}`}>{countdown}</dd>
        </div>
      </dl>
    </article>
  );
}
