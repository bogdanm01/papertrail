import { useState } from "react";
import axiosClient from "@/axiosClient";

export const useSignUp = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);

  const signUp = async (payload: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/api/v1/auth/sign-up", payload);
      setData(response.data);

      return response.data;
    } catch (e: any) {
      const message =
        e?.response?.data?.message ??
        e?.response?.statusText ??
        e?.message ??
        "Unknown error";
      setError(message);

      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, data, isLoading, error };
};
