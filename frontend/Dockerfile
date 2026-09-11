# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies using npm ci for reproducible builds
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Runtime stage
FROM nginxinc/nginx-unprivileged:alpine
LABEL maintainer="development-team"

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 (non-root nginx default)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
