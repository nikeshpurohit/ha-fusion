#!/bin/bash

remote="ssh server@100.95.107.106"
path="$(dirname "$(readlink -f "$0")")"

$remote "docker exec -i home-assistant bash -c 'python3'" < "$path/fetch.py" | \
python "$path/split.py" "$path/../../static/translations/"
