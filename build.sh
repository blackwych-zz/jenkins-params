#!/bin/bash

set -eu

declare dir="$(cd $(dirname "$0") && pwd)"

if [[ ! -d "${dir}/build" ]]; then
  echo "Create '${dir}/build'"
  mkdir "${dir}/build"
  echo
fi

echo 'Create jenkins-params.xpi...'
cd "${dir}/src"
zip -r ../build/jenkins-params.xpi *
echo 'Done'

echo
echo 'Build successfully finished.'
