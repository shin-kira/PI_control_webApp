FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /app
COPY --from=frontend-builder /app/dist ./dist
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server/index.js ./server/
WORKDIR /app/server
EXPOSE 3000
CMD ["node", "index.js"]
