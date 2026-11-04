"use client";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthTitle from "../shared/auth-title";

export function LoginForm() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
<AuthTitle>Become part of our family!</AuthTitle>

        <p className="mt-2 text-sm text-muted-foreground">
          Please enter your details to sign in.
        </p>
      </div>

      <form className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>

          <Input
            id="email"
           
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>

          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      {/* Register */}
      <p className="mt-6 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium underline">
          Register
        </Link>
      </p>
    </div>
  );
}