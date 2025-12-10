FROM nginx:latest


RUN apt update
RUN apt install nodejs npm -y

EXPOSE 8080

COPY Nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY React/Frontend /frontend 

WORKDIR /frontend
# RUN npm i deps
# RUN npm run build

CMD  ["/bin/bash", "./entry.sh"]


