#!/bin/bash

if [[ "$EUID" != 0 ]]; then
    echo "Should be run with 'sudo'"
    exit 1
fi

echo "Starting server..."
npm run start &
P1=$!

echo "Opening VPN Tunnel..."
openvpn --config ../gen.ovpn &
P2=$!


wait $P1 $P2
