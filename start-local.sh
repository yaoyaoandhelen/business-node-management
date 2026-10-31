#!/bin/sh
set -eu
cd -- "$(dirname -- "$0")"
exec node tooling/run.mjs studio dev --project project.config.yaml
