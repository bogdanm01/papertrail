import { AuthHeader } from "@/components/loginPage/AuthHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-neutral-100 h-screen flex items-center justify-center">
      <div className="bg-neutral-0 p-12 rounded-xl flex flex-col gap-4 w-[540px] large-shadow border border-neutral-200">
        <AuthHeader
          headline="Reset Your Password"
          tagline="Choose a new password to secure your account."
        ></AuthHeader>
        <Button>Reset Password</Button>
      </div>
    </div>
  );
}
