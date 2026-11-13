import type { NextAuthOptions } from "next-auth";

const authConfig: Omit<NextAuthOptions, "providers"> = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
};

export default authConfig;