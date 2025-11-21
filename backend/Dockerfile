FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests
ENTRYPOINT ["java","-jar","target/fs3-app-0.0.1-SNAPSHOT.jar"]
