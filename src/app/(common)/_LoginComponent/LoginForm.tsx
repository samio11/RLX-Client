"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoginAni from "../../../../public/Login.json";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { userLogin } from "@/services/user";
import { useUser } from "@/context/UserContext";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(4, "Password must be greater than 4 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const route = useRouter();
  const s1 = useSearchParams();
  const redirectPath = s1.get("redirectPath") || "/";
  const { refetchUser } = useUser();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(loginInfo: z.infer<typeof loginSchema>) {
    const toastId = toast.loading("User Logging...");
    try {
      const result = await userLogin(loginInfo);
      if (result?.success) {
        await refetchUser();
        toast.success(result?.message, { id: toastId });
        route.push(`${result?.data?.role}/dashboard`);
      } else {
        toast.error("User Login Failed", { id: toastId });
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message, { id: toastId });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left side form */}
          <div className="flex flex-col justify-center gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome To RLX</h1>
              <p className="text-muted-foreground text-balance">
                Login to your RLX account
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>

            {/* Sign up link */}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/register"} className="underline underline-offset-4">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Right side animation */}
          <div className="bg-muted relative hidden md:flex items-center justify-center">
            <Lottie animationData={LoginAni} loop={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
