import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import getUserModel from "../../../models/User";
import axios from 'axios';
import dbConnect from "../../../utils/dbConnect";

// API configuration
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_API_URL = process.env.RENDER_API_URL;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL;
const BASE_DOMAIN = process.env.BASE_DOMAIN;

// Enhanced error logging function
function logError(context, error) {
  console.error(`Error in ${context}:`);
  console.error(`Message: ${error.message}`);
  console.error(`Stack: ${error.stack}`);
  if (error.response) {
    console.error(`Response status: ${error.response.status}`);
    console.error(`Response data: ${JSON.stringify(error.response.data)}`);
  }
}

// Helper function to remove protocol from URL
function removeProtocol(url) {
  return url.replace(/^https?:\/\//, '');
}

// Render API functions
async function getServiceDetails() {
  try {
    const response = await axios.get(`${RENDER_API_URL}/services`, {
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
      },
      params: {
        limit: 20,
      },
    });
    const service = response.data[0].service;
    return {
      id: service.id,
      url: removeProtocol(service.serviceDetails.url)
    };
  } catch (err) {
    logError('getServiceDetails', err);
    return null;
  }
}

async function createCustomDomain(serviceId, domain) {
  try {
    const response = await axios.post(
      `${RENDER_API_URL}/services/${serviceId}/custom-domains`,
      { name: domain },
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Custom domain created:', response.data);
    return response.data;
  } catch (err) {
    logError('createCustomDomain', err);
    return null;
  }
}

// Cloudflare API function
async function createSubdomain(username, serviceUrl) {
  const subdomain = `${username}.${BASE_DOMAIN}`;
  const apiEndpoint = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`;

  try {
    const response = await axios.post(
      apiEndpoint,
      {
        type: 'CNAME',
        name: subdomain,
        content: serviceUrl, // This is now without the protocol
        ttl: 3600,
        proxied: true
      },
      {
        headers: {
          'X-Auth-Key': CLOUDFLARE_API_KEY,
          'X-Auth-Email': CLOUDFLARE_EMAIL,
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.status === 200 && response.data.success) {
      console.log(`Subdomain ${subdomain} created successfully`);
      return subdomain;
    } else {
      console.error(`Failed to create subdomain ${subdomain}`);
      console.error(`Response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    logError('createSubdomain', error);
    return null;
  }
}

// Function to create subdomain in Cloudflare and configure Render
async function setupSubdomain(username) {
  try {
    const serviceDetails = await getServiceDetails();
    if (serviceDetails) {
      const subdomain = await createSubdomain(username, serviceDetails.url);
      if (subdomain) {
        await createCustomDomain(serviceDetails.id, subdomain);
      } else {
        console.error('Failed to create subdomain in Cloudflare');
      }
      return subdomain;
    } else {
      console.error('Failed to get service details from Render');
      return null;
    }
  } catch (error) {
    logError('setupSubdomain', error);
    return null;
  }
}

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

        // Create subdomain for the user and configure Render
        const subdomain = await setupSubdomain(profile.login);
        if (subdomain) {
          githubUserData.subdomain = subdomain;
        } else {
          console.error(`Failed to set up subdomain for user ${profile.login}`);
        }
        await dbConnect();
        const UserModel = getUserModel();
        const dbUser = await UserModel.findOneAndUpdate(
          { email: user.email },
          githubUserData,
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        user.id = dbUser._id.toString();
        return true;
      } catch (error) {
        logError('signIn', error);
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
          await dbConnect();
          const UserModel = getUserModel();
          const dbUser = await UserModel.findById(token.userId).lean();

          if (dbUser) {
            session.user = {
              ...session.user,
              id: dbUser._id.toString(),
              username: dbUser.username,
              bio: dbUser.bio,
              location: dbUser.location,
              website: dbUser.website,
              githubLink: dbUser.githubLink,
              subdomain: dbUser.subdomain,
            };
          }
        } catch (error) {
          logError('session', error);
        }
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
