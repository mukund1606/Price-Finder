import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "user" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = {
          id: 1,
          name: "User",
          username: process.env.ADMIN_USERNAME,
          password: process.env.ADMIN_PASSWORD,
        };
        if (
          credentials.username.toLowerCase() === user.username.toLowerCase() &&
          credentials.password === user.password
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
