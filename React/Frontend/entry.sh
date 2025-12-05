#!/bin/sh
set -e
echo "starting nginx server"

export DOLLAR="$"
envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

nginx -t
exec nginx -g 'daemon off;'