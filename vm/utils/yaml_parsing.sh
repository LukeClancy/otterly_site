#!/bin/bash
#
# decrypts sops-encrypted creds and exports their keys
# (including nested ones) as environment variables.
#
# parse_yaml: modified for lists and unknown whitespace from https://stackoverflow.com/a/21189044
# (Stefan Farestam et al., CC BY-SA 3.0)
#
# decrypt_env: decrypts shared.enc.yaml then <project_env>.enc.yaml, exporting as env variables
#
# get_private_key: used to find which private key is actually needed for the thing to run. Made
#  to get around some inflexiblity in labeling keys properly

function parse_yaml {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\):|\1|" \
        -e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)-$s[\"']\?\(.*\)[\"']\?$s\$|\1$fs$fs\2|p"  $1 |
   awk -F$fs '
   function flush() {if (lk != "") printf("%s%s=\"[%s]\"\n", "'$prefix'", lk, lv); lk=""; lv=""}
   BEGIN {depth=0; ind[0]=-1}
   {
      w = length($1);
      while (depth > 0 && w <= ind[depth]) {delete vname[depth]; depth--}
      depth++; ind[depth] = w; vname[depth] = $2;
      for (i in vname) {if (i > depth) {delete vname[i]}}
      if ($2 == "") {
         k=""; for (i=1; i<depth; i++) {k = k (i>1 ? "_" : "") vname[i]}
         if (k != lk) {flush(); lk=k}
         lv=(lv=="" ? $3 : lv ", " $3);
         next;
      }
      flush();
      if (length($3) > 0) {
         vn=""; for (i=1; i<depth; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }
   END {flush()}'
}

print_yaml_env_vars() {
	local line
	while IFS= read -r line; do
		printf "$line\n"
	done < <(parse_yaml <(sops decrypt "$1"))
}

# Decrypts shared.enc.yaml then <project_env>.enc.yaml, exporting both
# (env-specific values override shared ones).
decrypt_env() {
	local project_env="development"
	print_yaml_env_vars "vm/creds/shared.enc.yaml"
	print_yaml_env_vars "vm/creds/$project_env.enc.yaml"
}

get_private_key() {
	local project_env=$1
	local env_file="vm/creds/$project_env.enc.yaml"
	local key
	while read -r key; do
		case "$key" in AGE-SECRET-KEY-*)
			if SOPS_AGE_KEY="$key" sops decrypt "$env_file" >/dev/null 2>&1; then
				echo "$key"
				return 0
			fi
		;; esac
   done < ~/.config/sops/age/keys.txt
   return 1
}
