# criação da imagem docker
FROM tomcat:11.0-jdk21-temurin

# remoção dos arquivops WEBAPPS DO TOMCAT
RUN rm -rf /usr/local/tomcat/webapps/*

# copia dos artigos do localhost para a imagem docker
COPY target/app.war /usr/local/tomcat/webapps/ROOT.war

# abri a porta 8080
EXPOSE 8080

# execução do docker
cmd ["catalina.sh", "run"]