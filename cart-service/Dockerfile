# Build stage
FROM maven:3.9.8-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
LABEL maintainer="development-team"

WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built jar from the builder stage
COPY --from=builder --chown=appuser:appgroup /build/target/*.jar app.jar

# Use the non-root user
USER appuser:appgroup

# Expose the application port
EXPOSE 8082

# Run the application with best-practice JVM options
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
