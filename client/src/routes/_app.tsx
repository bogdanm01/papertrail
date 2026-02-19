import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "@/hooks/query/auth/useMe";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient as QueryClient;

    try {
      await queryClient.ensureQueryData(meQueryOptions);
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div>
      <h1>App Layout</h1>
      <Outlet />
    </div>
  );
}
