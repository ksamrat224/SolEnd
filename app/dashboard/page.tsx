"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { LoanCard } from "../components/loan-card";
import { getLoans, getRiskScore } from "../lib/api";
import { getLoanPdaMap } from "../lib/loan-local";
import { useWallet } from "../lib/wallet/context";
import { useLoanProgram } from "../lib/hooks/use-loan-program";

type LocalRepayMap = Record<string, boolean>;

const LAMPORTS_PER_SOL = 1_000_000_000;

function lamportsStringToSol(value: string): string {
  const numeric = Number(value) / LAMPORTS_PER_SOL;
  return numeric.toLocaleString(undefined, {
    minimumFractionDigits: numeric < 1 ? 4 : 2,
    maximumFractionDigits: 4,
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { status, wallet } = useWallet();
  const { repayLoan, getPoolBalance, isSending } = useLoanProgram();
  const walletAddress = wallet?.account.address;

  const [localRepayState, setLocalRepayState] = useState<LocalRepayMap>({});

  useEffect(() => {
    if (status === "disconnected") {
      router.replace("/");
    }
  }, [router, status]);

  const loansQuery = useQuery({
    queryKey: ["loans", walletAddress],
    queryFn: () => getLoans(walletAddress!),
    enabled: status === "connected" && Boolean(walletAddress),
  });

  const riskScoreQuery = useQuery({
    queryKey: ["dashboard-score", walletAddress],
    queryFn: () => getRiskScore(walletAddress!),
    enabled: status === "connected" && Boolean(walletAddress),
  });

  const poolBalanceQuery = useQuery({
    queryKey: ["dashboard-pool-balance"],
    queryFn: getPoolBalance,
    enabled: status === "connected",
  });

  const repayMutation = useMutation({
    mutationFn: async (loanId: string) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      const pdaMap = getLoanPdaMap(walletAddress);
      const metadata = pdaMap[loanId];

      if (!metadata) {
        throw new Error(
          "Missing loan PDA metadata. Repayment for this loan is unavailable in this browser session."
        );
      }

      return repayLoan(
        metadata.loanPda,
        metadata.collateralPda,
        Number(metadata.loanIndex)
      );
    },
    onSuccess: (_, loanId) => {
      setLocalRepayState((prev) => ({ ...prev, [loanId]: true }));
      toast.success("Repayment transaction submitted.");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Repayment failed.");
    },
  });

  const loans = loansQuery.data ?? [];

  const activeLoans = useMemo(
    () =>
      loans.map((loan) => ({
        ...loan,
        status:
          localRepayState[loan.id] && loan.status === "ACTIVE"
            ? "REPAID"
            : loan.status,
      })),
    [localRepayState, loans]
  );

  if (status === "disconnected") {
    return null;
  }

  return (
    <div className="flex-1 bg-background text-foreground">
      

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="posthog-heading-display text-primary">
              Loan Dashboard
            </h1>
            <p className="mt-2 text-[16px] text-muted-foreground md:text-[18px]">
              Track active loans, pool liquidity, and your eligibility profile.
            </p>
          </div>

          <div className="posthog-card p-[16px] min-w-[140px]">
            <p className="text-[13px] font-bold uppercase tracking-wide text-muted-foreground">
              Risk Score
            </p>
            <p className="font-mono text-[32px] font-bold tabular-nums text-foreground mt-1">
              {riskScoreQuery.data
                ? Math.round(riskScoreQuery.data.score)
                : "--"}
            </p>
          </div>
        </div>

        <section className="mt-8 posthog-card p-6 bg-[#fdfdf8]">
          <p className="text-[14px] font-bold uppercase tracking-wide text-muted-foreground">Pool Balance</p>
          <p className="mt-2 font-mono text-[40px] font-bold tabular-nums text-primary leading-none">
            {poolBalanceQuery.data
              ? (
                  Number(poolBalanceQuery.data) / LAMPORTS_PER_SOL
                ).toLocaleString(undefined, { maximumFractionDigits: 4 })
              : "0"}{" "}
            <span className="text-[20px] text-muted-foreground">SOL</span>
          </p>
        </section>

        <section className="mt-12">
          <h2 className="posthog-heading-section text-primary">Active Loans</h2>

          {loansQuery.isLoading && (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[120px] animate-pulse rounded-[4px] bg-[#eeefe9] border border-[#bfc1b7]"
                />
              ))}
            </div>
          )}

          {loansQuery.isError && (
            <div className="mt-6 rounded-[4px] border border-destructive/30 bg-destructive/10 p-5 p-4 text-[15px]">
              <p className="font-semibold text-destructive">
                Unable to fetch loans.
              </p>
              <button
                type="button"
                onClick={() => loansQuery.refetch()}
                className="mt-3 posthog-btn-secondary"
              >
                Retry
              </button>
            </div>
          )}

          {!loansQuery.isLoading &&
            !loansQuery.isError &&
            activeLoans.length === 0 && (
              <div className="mt-6 posthog-card p-10 text-center flex flex-col items-center justify-center">
                <p className="text-[20px] font-bold text-foreground">
                  No active loans. Ready to borrow?
                </p>
                <Link
                  href="/borrow"
                  className="mt-6 posthog-btn-primary"
                >
                  Open Borrow Page
                </Link>
              </div>
            )}

          {activeLoans.length > 0 && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {activeLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
              </div>

              <div className="overflow-x-auto posthog-card !p-0">
                <table className="min-w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-[#bfc1b7] bg-[#eeefe9]/50 text-[12px] uppercase tracking-wider font-bold text-muted-foreground">
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Collateral</th>
                      <th className="px-5 py-4">Interest</th>
                      <th className="px-5 py-4">Due</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 font-bold tracking-wider text-muted-foreground text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans.map((loan) => {
                      const pdaMap = walletAddress
                        ? getLoanPdaMap(walletAddress)
                        : {};
                      const canRepay =
                        Boolean(pdaMap[loan.id]) && loan.status === "ACTIVE";

                      return (
                        <tr
                          key={loan.id}
                          className="border-b border-[#bfc1b7] last:border-0 hover:bg-[#eeefe9]/30 transition-colors"
                        >
                          <td className="px-5 py-4 font-mono tabular-nums font-semibold">
                            {lamportsStringToSol(loan.loanAmountLamports)} SOL
                          </td>
                          <td className="px-5 py-4 font-mono tabular-nums text-muted-foreground">
                            {lamportsStringToSol(loan.collateralAmountLamports)}{" "}
                            SOL
                          </td>
                          <td className="px-5 py-4 font-medium">
                            {(loan.interestBps / 100).toFixed(2)}%
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {new Date(
                              Number(loan.dueTimestamp) * 1000
                            ).toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center rounded-full bg-[#eeefe9] border border-[#bfc1b7] px-2.5 py-1 text-[12px] font-bold text-primary">
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              type="button"
                              disabled={
                                !canRepay ||
                                isSending ||
                                repayMutation.isPending
                              }
                              onClick={() => repayMutation.mutate(loan.id)}
                              className="posthog-btn-primary min-w-[80px] h-[32px] px-3 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {repayMutation.isPending
                                ? "..."
                                : "Repay"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
