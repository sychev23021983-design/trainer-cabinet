FROM node:20-alpine
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
