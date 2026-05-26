import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "../repositories/users";
import type { EmployeeFormValues } from "../types";
import { queryKeys } from "./queryKeys";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: userRepository.list
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: EmployeeFormValues) => userRepository.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users })
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => userRepository.setActive(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users })
  });
}
