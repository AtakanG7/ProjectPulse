import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "../../../models/User";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Optionally perform additional sign-in logic here
      return true;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          // Ensure the database is connected
          if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI);
          }

          // Fetch user by email
          const dbUser = await User.findOne({ email: session.user.email }).populate("projects");

          if (dbUser) {
            // Attach user data to session
            session.user.id = dbUser._id.toString();
            session.user.username = dbUser.username;
            session.user.projects = dbUser.projects; // Attach the user's projects
            console.log(session)
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  database: process.env.MONGODB_URI,
});
