FROM maven:3.6.3-jdk-11-slim AS build

WORKDIR /home/app

COPY . .

RUN mvn clean package

##############################

FROM tomcat

COPY --from=build /home/app/target/ROOT.war /usr/local/tomcat/webapps

RUN rm -rf /usr/local/tomcat/webapps/ROOT/*

EXPOSE 8080

CMD ["catalina.sh", "run"]

