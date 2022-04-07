#!/bin/bash

# bash 'strict mode'
# see: http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

docker build -t registry.gitlab.com/holofox/hololink/wayfinding:latest .
docker push registry.gitlab.com/holofox/hololink/wayfinding:latest

kubectl config use-context do-ams3-hololink-dev-kluster
kubectl config current-context

kubectl delete deployment wayfinding
kubectl apply -f ./ops/deployment.yaml