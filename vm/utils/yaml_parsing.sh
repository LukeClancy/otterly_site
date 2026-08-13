#!/bin/bash
#
# decrypts sops-encrypted creds and exports their keys
# (including nested ones) as environment variables.
#
# parse_yaml: adapted from https://stackoverflow.com/a/21189044
# (Stefan Farestam et al., CC BY-SA 3.0)
#
# decrypt_env: decrypts shared.enc.yaml then <project_env>.enc.yaml, exporting as env variables

parse_yaml() {
	local file=$1 prefix=$2
	local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs
	fs=$(printf '\034')
	sed -ne "s|^\($s\):|\1|" \
		-e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
		-e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p" "$file" |
	awk -F"$fs" -v prefix="$prefix" '{
		indent = length($1)/2;
		vname[indent] = $2;
		for (i in vname) {if (i > indent) {delete vname[i]}}
		if (length($3) > 0) {
			vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
			printf("%s%s%s=%s\n", prefix, vn, $2, $3);
		}
	}'
}

export_yaml_env_vars() {
	local line
	while IFS= read -r line; do
		export "$line"
	done < <(parse_yaml <(sops decrypt "$1"))
}

# Decrypts shared.enc.yaml then <project_env>.enc.yaml, exporting both
# (env-specific values override shared ones).
decrypt_env() {
	local project_env=$1
	local creds_dir
	creds_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../creds" && pwd)"
	export_yaml_env_vars "$creds_dir/shared.enc.yaml"
	export_yaml_env_vars "$creds_dir/$project_env.enc.yaml"
}