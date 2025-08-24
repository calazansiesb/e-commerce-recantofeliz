#!/bin/bash
while true; do
  git add .
  git commit -m "auto: versionamento automático $(date '+%Y-%m-%d %H:%M:%S')"
  git tag "auto-$(date '+%Y%m%d-%H%M%S')"
  sleep 3600
done
