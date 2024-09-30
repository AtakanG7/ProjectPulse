import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "../../../models/User";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);

        const githubUserData = {
          githubId: profile.id?.toString(),
          name: profile.name || profile.login,
          email: user.email,
          username: profile.login,
          profilePicture: profile.avatar_url,
          bio: profile.bio || "No bio provided",
          location: profile.location || "No location provided",
          website: profile.blog || "No website provided",
          githubLink: profile.html_url,
        };

        const dbUser = await User.findOneAndUpdate(
          { email: user.email },
          githubUserData,
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        user.id = dbUser._id.toString();
        return true;
      } catch (error) {
        console.error("Error during sign-in process:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        try {
          await mongoose.connect(process.env.MONGODB_URI);

          const dbUser = await User.findById(token.userId).lean();

          if (dbUser) {
            session.user = {
              ...session.user,
              id: dbUser._id.toString(),
              username: dbUser.username,
              bio: dbUser.bio,
              location: dbUser.location,
              website: dbUser.website,
              githubLink: dbUser.githubLink,
              // Add any other fields you want to include in the session
            };
          }
        } catch (error) {
          console.error("Error fetching user data for session:", error);
        }
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);