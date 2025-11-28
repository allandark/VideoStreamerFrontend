FROM nginx:latest


RUN apt update
RUN apt install nodejs npm -y

EXPOSE 80


COPY Nginx/nginx.conf /etc/nginx/nginx.conf
COPY React/Frontend /frontend 

WORKDIR /frontend
RUN npm i deps
RUN npm run build

ENTRYPOINT  ["./entry.sh"]


