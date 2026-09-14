#!/bin/bash

set -euo pipefail
cd "$(dirname "$0")/.."

# die if its dirty
if [ -n "$(git status --porcelain)" ]; then
	echo "push_production.sh: working tree is dirty - the image wouldn't match a real commit" >&2
	exit 1
fi

# TODO MUCH LATER make sure its tested, I theres a way to mark a commit tested using git I think.

# build the image
PROJECT_ENV=production docker compose -f docker-compose.yaml build

# push to registry
PROJECT_ENV=production docker compose -f docker-compose.yaml push

# move config to server
scp docker-compose.yaml root@cachyserver:~/docker-compose.yaml

# pull from running registry image to the server
ssh root@cachyserver PROJECT_ENV=production docker compose pull

# run on server using the config
ssh root@cachyserver PROJECT_ENV=production docker compose up -d