FROM maven:3.8.6-openjdk-11-slim AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim

WORKDIR /app

COPY --from=builder /app/target/farmgear-core-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
