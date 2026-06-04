#!/usr/bin/env bash
# Push CyberSecuritySystem to GitHub (run locally with a valid PAT)
set -euo pipefail

REPO_URL="https://github.com/tanjiroakainu1/CyberSecuritySystem.git"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "Set your GitHub personal access token first:"
  echo "  export GITHUB_TOKEN=ghp_your_token_here"
  echo "Then run this script again."
  exit 1
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not a git repository. Run from project root after git init."
  exit 1
fi

echo "Verifying token with GitHub API..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  https://api.github.com/user)

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "GitHub rejected the token (HTTP ${HTTP_CODE})."
  echo "Create a new classic token at https://github.com/settings/tokens with 'repo' scope."
  exit 1
fi

echo "Pushing main to ${REPO_URL} ..."
git push "https://x-access-token:${GITHUB_TOKEN}@github.com/tanjiroakainu1/CyberSecuritySystem.git" main

if git remote get-url origin >/dev/null 2>&1; then
  git branch --set-upstream-to=origin/main main 2>/dev/null || true
fi

echo "Done. View repo: https://github.com/tanjiroakainu1/CyberSecuritySystem"
