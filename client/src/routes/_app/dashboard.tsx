import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="text-preset-1">App</h1>
      <p>Welcome to papertrail</p>
    </div>
  );
}
