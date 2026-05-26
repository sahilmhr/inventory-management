import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productRepository } from "../repositories/products";
import type { ProductFormValues } from "../types";
import { queryKeys } from "./queryKeys";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: productRepository.list
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProductFormValues) => productRepository.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products })
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProductFormValues }) => productRepository.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products })
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products })
  });
}
