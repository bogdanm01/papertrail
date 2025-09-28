import { AuthHeader } from "@/components/loginPage/AuthHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import googleIcon from "/icon-google.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@/hooks/useSignUp";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email("Please enter a valid email").min(2).max(50),
  password: z
    .string()
    .regex(
      /^(?=.{8,})(?:(?=.*\d)|(?=.*[^A-Za-z0-9])).*$/,
      "Must be 8+ characters with number or symbol"
    ),
});

function RouteComponent() {
  const { signUp, isLoading, error } = useSignUp();
  const navigate = useNavigate({ from: "/register" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signUp(values);

    if (!error && !isLoading) {
      navigate({ to: "/dashbord" });
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-zinc-50 to-slate-50 h-screen flex items-center justify-center">
      <div className="flex large-shadow border rounded-md border-neutral-100 h-[576px] w-4xl bg-neutral-0 overflow-hidden">
        <div className="w-1/2 h-full p-12 flex flex-col gap-5 justify-center">
          <AuthHeader headline="Welcome!" tagline="Create a new account." />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormItem>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="py-[18px]"
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        ></Input>
                      </FormControl>

                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              </FormItem>
              <FormItem>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="py-[18px]"
                          placeholder="Enter your password"
                          type="password"
                          autoComplete="none"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>
              <Button
                className="w-full cursor-pointer"
                size="lg"
                disabled={isLoading}
              >
                {isLoading && <Loader2Icon className="animate-spin" />}
                {isLoading ? "Please wait" : "Sign Up"}
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-center">
            <hr className="h-[1px] w-full bg-neutral-700" />
            <span className="px-3 text-sm text-nowrap text-neutral-600">
              or
            </span>
            <hr className="h-[1px] w-full bg-neutral-700" />
          </div>

          <Button className="w-full cursor-pointer" variant="outline" size="lg">
            <img src={googleIcon} alt="google icon" />
            Continue with Google
          </Button>

          <p className="text-center text-preset-5 mt-3">
            Already have an account?{" "}
            <a tabIndex={0}>
              <Link to="/login">
                <span className="font-medium cursor-pointer">Sign In</span>
              </Link>
            </a>
          </p>
        </div>
        <div className="w-1/2 h-full p-2">
          <img
            className="w-full h-full object-cover rounded"
            src="https://images.unsplash.com/photo-1514621166532-aa7eb1a3a2f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
      </div>
    </div>
  );
}
