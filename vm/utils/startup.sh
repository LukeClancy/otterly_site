#!/bin/bash

set -euo pipefail

source ./vm/utils/yaml_parsing.sh

project_env="${PROJECT_ENV:-development}"

age_key="$(get_private_key "$project_env")" || {
	echo "startup.sh: no matching age key found for '$project_env'" >&2
	exit 1
}

echo "SOPS_AGE_KEY=$(get_private_key "$project_env")" > vm/.env
echo "PROJECT_ENV=${PROJECT_ENV:-development}" >> vm/.env
