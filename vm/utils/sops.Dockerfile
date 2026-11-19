# Runs compose_config so the host only needs docker, not sops or age.
FROM alpine:3.24

RUN apk add --no-cache bash sops age
WORKDIR /app
RUN touch a_second_file
