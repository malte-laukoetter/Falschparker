#!/usr/bin/env bash

npm run build

if git diff --quiet HEAD^ HEAD functions/; then
  echo "No function changes, skip function deployment."
else 
  npm run deploy:functions
fi
