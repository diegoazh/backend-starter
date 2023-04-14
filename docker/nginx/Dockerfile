FROM nginx:1.23.3
COPY ./nginx.conf /etc/nginx/
COPY ./api_gateway.conf /etc/nginx/
COPY ./api_json_errors.conf /etc/nginx/
COPY ./api_keys.conf /etc/nginx/
COPY ./cors.conf /etc/nginx/
COPY ./api_conf.d /etc/nginx/api_conf.d
COPY ./certificates/own-ca/starter.io.crt /etc/ssl/certs/
COPY ./certificates/own-ca/starter.io.key /etc/ssl/certs/
