import { meQueryOptions } from "@/hooks/query/auth/useMe";
import { useSignOut } from "@/hooks/query/auth/useSignOut";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { mutateAsync: signOut } = useSignOut();
  const { data: user } = useQuery(meQueryOptions);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-semibold">Authenticated</h1>
      <div>User: {user?.email}</div>
      <p onClick={() => handleLogout()}>logout</p>
    </div>
  );
}
