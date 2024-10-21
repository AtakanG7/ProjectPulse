# Use the official Node.js image as a base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Use a smaller, production-ready image
FROM node:18-slim AS production

# Set the working directory
WORKDIR /app

# Copy built files and node_modules from the build stage
COPY --from=build /app ./

# Expose the port and start the app
EXPOSE 3000
CMD ["npm", "start"]

