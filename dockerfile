# Base image
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build

# Start a new stage from a smaller base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy build files from the previous stage
COPY --from=build /app ./

# Install production dependencies
RUN npm install --only=production

# Expose the port on which the app will run
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
