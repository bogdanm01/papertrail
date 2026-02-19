import { queryOptions } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";
import type { AuthUser } from "@/lib/interfaces/authUser";
import { isAxiosError } from "axios";

export const meQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: async (): Promise<AuthUser> => {
    try {
      const res = await axiosClient.get("/api/v1/auth/me");
      return res.data.data;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        throw new Error("Not authenticated");
      }
      throw new Error("Failed to load user");
    }
  },
  retry: false,
});
