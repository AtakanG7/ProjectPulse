# Use the official Node.js image as a base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install dependencies and build the app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Expose the port and start the app
EXPOSE 3000
CMD ["npm", "start"]




