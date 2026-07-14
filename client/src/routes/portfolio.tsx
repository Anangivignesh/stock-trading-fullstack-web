import { createFileRoute } from "@tanstack/react-router";
import PortfolioPage from "../pages/Portfolio";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — SB Stocks" }] }),
  component: PortfolioPage,
});
