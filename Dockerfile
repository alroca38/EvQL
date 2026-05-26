FROM node:20-alpine AS development
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build


FROM node:20-alpine AS build-prod
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate && npm cache clean --force


FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=build-prod /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist
COPY package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main"]