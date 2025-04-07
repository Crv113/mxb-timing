# mxb-timing/Dockerfile
FROM node:18 AS build

WORKDIR /app

# Étape 1 : installer dépendances avec cache
COPY package*.json ./
RUN npm install

# Étape 2 : copier le reste des sources et build
COPY . .
RUN npm run build
