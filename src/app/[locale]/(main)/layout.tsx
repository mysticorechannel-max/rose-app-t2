import type { ReactNode } from "react";

import { Footer, Header } from "@/shared/components";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
