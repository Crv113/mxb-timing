# Étape 1 : Build du front
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape finale (ne sert qu’à copier le build, pas à servir)
FROM alpine:latest
WORKDIR /dist
COPY --from=builder /app/dist ./
