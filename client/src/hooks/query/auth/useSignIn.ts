import axiosClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      axiosClient.post("api/v1/auth/sign-in", payload),
    onSuccess: async () => {
      //   queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate({ to: "/dashboard" });
    },
  });
};
