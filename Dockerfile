# Stage 1: Base image
FROM node:20.12.2-alpine3.18 as base

# Stage 2: Dependencies
FROM base as deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 3: Build
FROM deps as build
WORKDIR /app
COPY . .
RUN npm run build

# Stage 4: Production
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
