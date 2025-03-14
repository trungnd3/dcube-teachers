#############
# development build
#############

# Stage 1: Build the NestJS application
FROM node:20-alpine AS build

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
# Copy package.json and package-lock.json
# A * will ensure both package.json AND package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# Copy the current directory to the APP folder
COPY . .

# Build the application
RUN npm run build

#############
# PRODUCTION BUILD
#############

# Stage 2: Create a smaller production image
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application from the previous stage
COPY --from=build /app/dist ./dist

RUN ls -la /app/dist

# Command to run the app
CMD ["/bin/sh", "-c", "npm run migration:run && node /app/dist/src/main"]
