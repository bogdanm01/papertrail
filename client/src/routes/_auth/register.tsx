import { Header } from "@/components/loginPage/Header";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import googleIcon from "/icon-google.svg";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-neutral-100 h-screen flex items-center justify-center">
      <div className="bg-neutral-0 p-12 rounded-xl flex flex-col gap-4 w-[540px] large-shadow border border-neutral-200">
        <Header
          headline="Create Your Account"
          tagline="Sign up to start organizing your notes and boost your productivity."
        ></Header>
        <Button>Sign up</Button>

        <div className="border-t border-neutral-200 flex flex-col text-center pt-6 gap-4">
          <p className="text-preset-5 text-neutral-600">Or log in with:</p>
          <Button variant="outline">
            <img src={googleIcon} alt="google icon" />
            Google
          </Button>
        </div>

        <footer className="text-center">
          <p className="text-preset-5 text-neutral-600">
            Already have an account?{" "}
            <span
              className="text-neutral-950 cursor-pointer"
              role="button"
              tabIndex={0}
            >
              Login
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
