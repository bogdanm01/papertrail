import axiosClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useSignOut = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axiosClient.post("/api/v1/auth/sign-out"),
    onSuccess: () => {
      queryClient.clear();
      navigate({ to: "/login" });
    },
  });
};
