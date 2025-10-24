import { Button } from "@/components/ui/button";
import useUser from "@/hooks/query/auth/useGetUser";
import { useSignOut } from "@/hooks/query/auth/useSignOut";
import queryClient from "@/lib/queryClient";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isLoading } = useUser();
  const { mutate: signOut } = useSignOut();
  const navigate = useNavigate({ from: "/dashboard" });

  const handleLogout = () => {
    signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="text-center">
        <h1 className="text-preset-1">App</h1>
        <p>Welcome to papertrail</p>
      </div>
      <div>{isLoading ? "loading" : JSON.stringify(user, null, 2)} </div>
      <Button
        className="cursor-pointer"
        variant={"outline"}
        onClick={handleLogout}
      >
        Sign out
      </Button>
    </div>
  );
}
