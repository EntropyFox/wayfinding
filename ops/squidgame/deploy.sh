#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

docker build -t registry.gitlab.com/holofox/hololink/viewer:experimentariet-squid .
docker push registry.gitlab.com/holofox/hololink/viewer:experimentariet-squid