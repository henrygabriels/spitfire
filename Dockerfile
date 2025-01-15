FROM node:18

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set Node.js environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS='--loader ts-node/esm'

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 