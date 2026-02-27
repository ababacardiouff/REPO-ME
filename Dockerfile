FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/dist /app/node_modules ./
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
