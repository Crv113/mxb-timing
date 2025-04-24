# Étape 1 : Build du front
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Image finale juste pour stocker les fichiers buildés
FROM alpine:latest
WORKDIR /dist
COPY --from=builder /app/dist ./dist
