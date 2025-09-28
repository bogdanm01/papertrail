import { useState } from "react";
import axiosClient from "@/axiosClient";
import { useNavigate } from "@tanstack/react-router";

export const useSignUp = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const signUp = async (payload: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/api/v1/auth/sign-up", payload);
      setData(response.data);
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data);
      } else if (error.request) {
        setError(error.request);
      } else {
        setError((error as Error).message as string);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, data, isLoading, error };
};
