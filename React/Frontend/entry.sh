#!/bin/sh
set -e
echo "starting nginx server"
echo "${SERVER_NAME}:${PORT}"
export DOLLAR="$"
# envsubst '${SERVER_NAME} ${API_SERVER_NAME} ${PORT}' \
#     < /etc/nginx/nginx.conf.template \
#     > /etc/nginx/nginx.conf
envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
cat /etc/nginx/nginx.conf
nginx -t
exec nginx -g 'daemon off;'