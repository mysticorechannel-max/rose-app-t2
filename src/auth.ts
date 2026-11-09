import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import authConfig from "./auth.config";
import { loginApi } from "./lib/auth/apis/login.api";

export const authOptions: NextAuthOptions = {
  ...authConfig,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await loginApi({
            username: credentials.username,
            password: credentials.password,
          });

          if (!response.status || !response.payload?.user) {
            return null;
          }

          const user = response.payload.user;

          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            username: user.username,
            role: user.role,
            accessToken: response.payload.token,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.username = token.username;

      return session;
    },
  },
};