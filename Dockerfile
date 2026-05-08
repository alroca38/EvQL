FROM node:22-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
RUN apt-get update -y && apt-get install -y libssl1.1 && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]