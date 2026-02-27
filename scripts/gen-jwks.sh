#!/usr/bin/env bash
set -euo pipefail

mkdir -p jwks
openssl genrsa -out jwks/private.pem 2048
openssl rsa -in jwks/private.pem -pubout -out jwks/public.pem
npx node-jose-tools fromPEM jwks/public.pem --kid molam-staging-key-1 > jwks/jwks.json

echo "JWKS generated at jwks/jwks.json"
