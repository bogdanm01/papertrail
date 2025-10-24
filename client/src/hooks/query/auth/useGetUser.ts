import axiosClient from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  return useQuery<{ email: string }>({
    queryKey: ["user"],
    queryFn: () =>
      axiosClient.get("/api/v1/auth/me").then((res) => res.data.data),
    retry: false,
  });
};

export default useUser;
