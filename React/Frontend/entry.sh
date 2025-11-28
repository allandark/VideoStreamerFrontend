#!/bin/sh
set -e 
echo "starting nginx server"
envsubst '${SERVER_NAME} ${API_SERVER_NAME} ${PORT}' \
    < /etc/nginx/nginx.conf.template \
    > /etc/nginx/nginx.conf

nginx -t
exec nginx -g 'daemon off;'