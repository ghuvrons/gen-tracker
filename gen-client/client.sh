#!/bin/bash

echo "Starting client..."
quasar dev &
P0=$!

wait $P0
