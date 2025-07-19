# Stage 1: Build the app
FROM node:18 AS build

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the app in a smaller image
FROM node:18 AS production

# Set working directory in the container
WORKDIR /app

# Install only the production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the build files from the build stage
COPY --from=build /app/.next .next
COPY --from=build /app/public public

# Expose the port on which Next.js will run
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
