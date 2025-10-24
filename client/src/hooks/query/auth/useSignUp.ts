import axiosClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      axiosClient.post("/api/v1/auth/sign-up", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
};
