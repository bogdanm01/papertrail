import { useState } from "react";
import axiosClient from "@/axiosClient";

export const useSignUp = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const signUp = async (payload: { email: string; password: string }) => {
    const response = await axiosClient.post("/api/v1/sign-up");
    console.log(response);
  };
};
