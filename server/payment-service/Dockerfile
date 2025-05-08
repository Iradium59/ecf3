FROM openjdk:11-jdk-slim

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw package -DskipTests

EXPOSE ${PAYMENT_SERVICE_PORT}

ENTRYPOINT ["java", "-jar", "target/payment-service.jar"]