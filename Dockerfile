# Étape 1 : build du front
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape finale : on copie dans le bon dossier Nginx
FROM alpine:latest
RUN mkdir -p /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .