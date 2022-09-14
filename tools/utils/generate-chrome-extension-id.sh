#!/bin/bash

# We need to be able to work with a fixed Extension ID for the purpose of smoke testing the extension
# consistently across both local development and CI.
#
# There is a "key" property in the manifest.json that we can set to help achieve this, and the following
# script handles generating both the base64 encoded value that goes in the manifest.json, as well as the
# extension ID that we see and use when running the extension in the browser.
#
# Adapted from https://gist.github.com/flotwig/37121c884d2f19712935eb1bc9a55efe and https://stackoverflow.com/a/23877974/3474615

rm -rf tmp/chrome-extension-key
mkdir -p tmp/chrome-extension-key

2>/dev/null openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out tmp/chrome-extension-key/key.pem
2>/dev/null openssl rsa -in tmp/chrome-extension-key/key.pem -pubout -outform DER | openssl base64 -A > tmp/chrome-extension-key/manifest_key.txt
2>/dev/null openssl rsa -in tmp/chrome-extension-key/key.pem -pubout -outform DER |  shasum -a 256 | head -c32 | tr 0-9a-f a-p > tmp/chrome-extension-key/extension_id.txt

cat tmp/chrome-extension-key/extension_id.txt
