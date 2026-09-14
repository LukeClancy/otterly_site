#!/bin/bash
#
# list_images.sh
# Run ON cachyserver. Lists images known to the local docker daemon and
# images/tags stored in the local registry (cachyserver:5000).

set -euo pipefail

echo "=== docker daemon images ==="
docker images

echo
echo "=== registry images (localhost:5000) ==="
repos="$(curl -fsSL http://localhost:5000/v2/_catalog | jq -r '.repositories[]?')"
if [ -z "$repos" ]; then
	echo "(no repositories)"
	exit 0
fi

for repo in $repos; do
	tags="$(curl -fsSL "http://localhost:5000/v2/${repo}/tags/list" | jq -r '.tags[]? // empty')"
	if [ -z "$tags" ]; then
		echo "${repo} (no tags)"
		continue
	fi
	for tag in $tags; do
		echo "${repo}:${tag}"
	done
done
