import { createFileRoute } from "@tanstack/react-router";
import TransactionsPage from "../pages/Transactions";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transactions — SB Stocks" }] }),
  component: TransactionsPage,
});
