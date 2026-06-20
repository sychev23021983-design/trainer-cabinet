FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000
CMD ["sh", "-c", "DATABASE_URL=file:/app/data/trainer.db npx prisma db push && node dist/index.js"]
