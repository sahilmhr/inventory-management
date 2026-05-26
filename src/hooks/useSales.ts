import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { salesRepository } from "../repositories/sales";
import type { ReportFilters, SaleFormValues } from "../types";
import { queryKeys } from "./queryKeys";

export function useSales(filters?: Partial<ReportFilters>) {
  return useQuery({
    queryKey: [...queryKeys.sales, filters],
    queryFn: () => salesRepository.list(filters)
  });
}

export function useRecordSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SaleFormValues) => salesRepository.record(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.sales });
    }
  });
}
