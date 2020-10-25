FROM nginx:latest
# see https://hub.docker.com/_/nginx/
COPY build /usr/share/nginx/html
EXPOSE 80
