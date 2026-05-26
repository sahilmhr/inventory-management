import { useMemo } from "react";
import { buildAnalytics } from "../lib/analytics";
import type { ReportFilters } from "../types";
import { useProducts } from "./useInventory";
import { useSales } from "./useSales";

export function useAnalytics(filters?: Partial<ReportFilters>) {
  const productsQuery = useProducts();
  const salesQuery = useSales();

  const summary = useMemo(
    () => buildAnalytics(productsQuery.data ?? [], salesQuery.data ?? [], filters),
    [productsQuery.data, salesQuery.data, filters]
  );

  return {
    summary,
    isLoading: productsQuery.isLoading || salesQuery.isLoading
  };
}
