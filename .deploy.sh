#!/usr/bin/env bash
set -eo pipefail

deploy() {
  local app_dir
  app_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
  cd "$app_dir"

  # Activate the Node.js environment created by Himalayan Host.
  source /home2/tejbrick/nodevenv/tejbricks/24/bin/activate

  if [[ "$(git branch --show-current)" != main ]]; then
    echo 'Deployment requires the main branch.' >&2
    return 1
  fi
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo 'Tracked files have local changes. Resolve them before deploying.' >&2
    return 1
  fi

  git pull --ff-only origin main
  export NODE_ENV=production
  export NEXT_PUBLIC_SITE_URL=https://tejbricks.com
  # Shared hosting exposes more CPU cores than its thread quota allows.
  export TEJ_BUILD_LOW_RESOURCE=1
  export TOKIO_WORKER_THREADS=1
  export RAYON_NUM_THREADS=1
  export UV_THREADPOOL_SIZE=1

  # npm install preserves CloudLinux's managed node_modules symlink.
  npm install --include=dev --no-package-lock --no-audit --no-fund
  # Webpack resolves CloudLinux packages outside the application directory.
  npm run build -- --webpack

  # Passenger reloads the application after a successful build.
  mkdir -p tmp
  touch tmp/restart.txt
  echo 'Build complete; application restart requested. Check https://tejbricks.com.'
}

deploy "$@"
