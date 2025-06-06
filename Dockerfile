FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "run", "docker-start"]
