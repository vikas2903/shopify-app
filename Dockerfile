FROM node:18-alpine

# If using native modules, uncomment the line below:
# RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

RUN npm remove @shopify/cli

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "docker-start"]
