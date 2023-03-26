FROM quay.io/keycloak/keycloak:21.0 AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:21.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# change these values to point to a running postgres instance
# documentation about configuration format: https://www.keycloak.org/server/configuration
# documentation about all configuration: https://www.keycloak.org/server/all-config
ENV KEYCLOAK_ADMIN=${KEYCLOAK_ADMIN}
ENV KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD}
ENV KC_DB=${KC_DB}
ENV KC_DB_URL=${KC_DB_URL}
ENV KC_DB_USERNAME=${KC_DB_USERNAME}
ENV KC_DB_PASSWORD=${KC_DB_PASSWORD}
ENV KC_HOSTNAME=${KC_HOSTNAME}
# ENV KC_HOSTNAME_PORT=${KC_HOSTNAME_PORT}
ENV KC_HOSTNAME_STRICT=${KC_HOSTNAME_STRICT}
ENV KC_HOSTNAME_STRICT_HTTPS=${KC_HOSTNAME_STRICT_HTTPS}
ENV KC_HOSTNAME_STRICT_BACKCHANNEL=${KC_HOSTNAME_STRICT_BACKCHANNEL}
ENV KC_HTTP_PORT=${KC_HTTP_PORT}
ENV KC_PROXY=${KC_PROXY}
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
