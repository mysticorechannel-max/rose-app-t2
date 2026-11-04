import Image from "next/image";
import type { ReactNode } from "react";
import QueryProvider from "../providers/query-provider";
import AuthFlourish from "./auth-flourish";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Form Section */}
        <section className="relative flex min-h-screen flex-col justify-center px-6 py-8">
          {/* Top Decoration */}
          <div className="flex justify-center">
            <AuthFlourish position="top" />
          </div>

          {/* Language Switcher */}
          <div className="absolute right-6 top-6">{/* Language Switcher */}</div>

          {/* Form Content */}
          <div className="flex flex-col items-center justify-center mt-10 mb-10">
            <div className="w-full max-w-md">
              <QueryProvider>{children}</QueryProvider>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="flex justify-center">
            <AuthFlourish position="bottom" />
          </div>
        </section>

        {/* Gift Image */}
        <section className="relative hidden min-h-screen lg:flex lg:items-center lg:justify-center">
          <div className="relative h-screen w-full">
            <Image
              src="/images/auth/Cover.png"
              alt="Gift boxes"
              fill
              priority
              sizes="50vw"
              className="object-cover object-center"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
