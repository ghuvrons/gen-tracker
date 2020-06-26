#!/bin/bash

if [[ "$EUID" != 0 ]]; then
    echo "Should be run with 'sudo'"
    exit 1
fi

echo "Starting client..."
pushd gen-client
quasar dev &
P0=$!
popd 

echo "Starting server..."
pushd gen-server
npm run start &
P1=$!
popd

echo "Opening VPN Tunnel..."
openvpn --config gen.ovpn &
P2=$!


wait $P0 $P1 $P2
