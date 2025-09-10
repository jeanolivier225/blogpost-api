FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=user

COPY /create_database.sql /docker-entrypoint-initdb.d/
