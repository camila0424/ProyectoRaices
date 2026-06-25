FROM node:22-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/app.js"]
