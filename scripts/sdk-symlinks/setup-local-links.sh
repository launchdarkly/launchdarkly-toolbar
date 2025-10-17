#!/bin/bash

# Automatic Local Linking Setup Script
# Sets up the local development chain: js-sdk-common -> js-client-sdk -> toolbar

set -Eeuo pipefail

echo "🔗 Setting up LaunchDarkly Local Development Links..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get directories (portable realpath)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE_DIR="$(dirname "$BASE_DIR")"

# Placeholder repository paths (will be finalized after parsing config/flags)
JS_COMMON_DIR=""
JS_CLIENT_DIR=""
TOOLBAR_DIR=""

log_step() {
    echo -e "\n${CYAN}=== $1 ===${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

resolve_path() {
    # Resolves a path to absolute, relative to WORKSPACE_DIR when not absolute
    local input_path="$1"
    if [ -z "$input_path" ]; then
        echo ""; return 0
    fi
    if [ "${input_path#/}" != "$input_path" ]; then
        (cd "$input_path" 2>/dev/null && pwd -P) || echo "$input_path"
    else
        (cd "$WORKSPACE_DIR/$input_path" 2>/dev/null && pwd -P) || echo "$WORKSPACE_DIR/$input_path"
    fi
}

show_help() {
    cat <<EOF
Usage: $(basename "$0") [options]

Options:
  -w, --workspace <dir>       Override workspace directory (defaults to parent of repo root)
      --js-common <dir>       Path to js-sdk-common
      --js-client <dir>       Path to js-client-sdk
      --toolbar <dir>         Path to launchdarkly-toolbar
  -h, --help                  Show this help and exit

Environment overrides:
  LD_WORKSPACE_DIR, LD_JS_COMMON_DIR, LD_JS_CLIENT_DIR, LD_TOOLBAR_DIR
  Precedence: flags > env > defaults.
EOF
}

parse_args() {
    WORKSPACE_DIR_OVERRIDE="${WORKSPACE_DIR_OVERRIDE:-}"
    CLI_JS_COMMON_DIR="${CLI_JS_COMMON_DIR:-}"
    CLI_JS_CLIENT_DIR="${CLI_JS_CLIENT_DIR:-}"
    CLI_TOOLBAR_DIR="${CLI_TOOLBAR_DIR:-}"
    while [ $# -gt 0 ]; do
        case "$1" in
            -w|--workspace)
                [ $# -ge 2 ] || { log_error "Missing value for $1"; exit 1; }
                WORKSPACE_DIR_OVERRIDE="$2"; shift 2 ;;
            --js-common)
                [ $# -ge 2 ] || { log_error "Missing value for $1"; exit 1; }
                CLI_JS_COMMON_DIR="$2"; shift 2 ;;
            --js-client)
                [ $# -ge 2 ] || { log_error "Missing value for $1"; exit 1; }
                CLI_JS_CLIENT_DIR="$2"; shift 2 ;;
            --toolbar)
                [ $# -ge 2 ] || { log_error "Missing value for $1"; exit 1; }
                CLI_TOOLBAR_DIR="$2"; shift 2 ;;
            -h|--help)
                show_help; exit 0 ;;
            *)
                log_warning "Unknown argument: $1"; shift ;;
        esac
    done
}

load_config() {
    : # config file support removed
}

parse_args "$@"

# Allow overriding workspace from flags/env; resolve to absolute
WORKSPACE_DIR="$(resolve_path "${WORKSPACE_DIR_OVERRIDE:-${LD_WORKSPACE_DIR:-$WORKSPACE_DIR}}")"

# Compute defaults relative to the (possibly overridden) workspace
DEFAULT_JS_COMMON_DIR="$WORKSPACE_DIR/js-sdk-common"
DEFAULT_JS_CLIENT_DIR="$WORKSPACE_DIR/js-client-sdk"
DEFAULT_TOOLBAR_DIR="$WORKSPACE_DIR/launchdarkly-toolbar"

# Load optional config for directory overrides
:

# Finalize directories with precedence: flags > env > config > defaults
JS_COMMON_DIR="$(resolve_path "${CLI_JS_COMMON_DIR:-${LD_JS_COMMON_DIR:-$DEFAULT_JS_COMMON_DIR}}")"
JS_CLIENT_DIR="$(resolve_path "${CLI_JS_CLIENT_DIR:-${LD_JS_CLIENT_DIR:-$DEFAULT_JS_CLIENT_DIR}}")"
TOOLBAR_DIR="$(resolve_path "${CLI_TOOLBAR_DIR:-${LD_TOOLBAR_DIR:-$DEFAULT_TOOLBAR_DIR}}")"

log_step "Effective Directories"
echo -e "${BLUE}WORKSPACE_DIR${NC}: $WORKSPACE_DIR"
echo -e "${BLUE}JS_COMMON_DIR${NC}:  $JS_COMMON_DIR"
echo -e "${BLUE}JS_CLIENT_DIR${NC}:  $JS_CLIENT_DIR"
echo -e "${BLUE}TOOLBAR_DIR${NC}:    $TOOLBAR_DIR"

require_cmd() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        log_error "Required command not found: $cmd"
        exit 1
    fi
}

ensure_installed_if_missing() {
    # Installs dependencies if node_modules is missing or FORCE_INSTALL=1
    local manager="$1" # npm | pnpm
    if [ "${FORCE_INSTALL:-0}" = "1" ] || [ ! -d node_modules ]; then
        if [ "$manager" = "npm" ]; then
            if [ -f package-lock.json ]; then
                npm ci --silent
            else
                npm install --no-audit --no-fund --silent
            fi
        else
            pnpm install --prefer-offline --silent
        fi
    fi
}

trap 'log_error "Setup failed at line $LINENO"' ERR

check_directory() {
    local dir="$1"
    local name="$2"

    if [ ! -d "$dir" ]; then
        log_error "$name directory not found: $dir"
        return 1
    fi
    log_success "$name directory found"
    return 0
}

# Verify all repositories exist
log_step "Checking Repository Structure"
check_directory "$JS_COMMON_DIR" "js-sdk-common" || exit 1
check_directory "$JS_CLIENT_DIR" "js-client-sdk" || exit 1
check_directory "$TOOLBAR_DIR" "launchdarkly-toolbar" || exit 1

log_step "Checking required commands"
require_cmd npm
require_cmd pnpm
require_cmd awk

# Step 1: Set up js-sdk-common for global linking
log_step "Setting up js-sdk-common for global linking"
cd "$JS_COMMON_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

ensure_installed_if_missing npm

# Remove existing global link if it exists
npm unlink launchdarkly-js-sdk-common 2>/dev/null || true
# Create global link
if npm link; then
    log_success "js-sdk-common globally linked"
else
    log_error "Failed to globally link js-sdk-common"
    exit 1
fi

# Step 2: Link js-sdk-common to js-client-sdk
log_step "Linking js-sdk-common → js-client-sdk"
cd "$JS_CLIENT_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

ensure_installed_if_missing npm

# Remove existing node_modules link
rm -rf node_modules/launchdarkly-js-sdk-common 2>/dev/null || true
# Link to local js-sdk-common
if npm link launchdarkly-js-sdk-common; then
    log_success "js-sdk-common linked to js-client-sdk"
else
    log_error "Failed to link js-sdk-common to js-client-sdk"
    exit 1
fi

# Set up js-client-sdk for global linking
if npm link; then
    log_success "js-client-sdk globally linked"
else
    log_error "Failed to globally link js-client-sdk"
    exit 1
fi


# Step 4: Add workspace overrides and link SDKs to toolbar (using pnpm)
log_step "Adding workspace overrides and linking SDKs → toolbar (pnpm)"
cd "$TOOLBAR_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

# Add or update overrides in pnpm-workspace.yaml (idempotent)
log_step "Adding/updating workspace overrides in pnpm-workspace.yaml"
if [ ! -f pnpm-workspace.yaml ]; then
    echo "overrides:" > pnpm-workspace.yaml
    echo "  launchdarkly-js-client-sdk: link:../js-client-sdk" >> pnpm-workspace.yaml
else
    # Update only if override not already present; back up only when modifying
    if ! grep -q "^[[:space:]]\{2\}launchdarkly-js-client-sdk: link:../js-client-sdk" pnpm-workspace.yaml; then
        cp pnpm-workspace.yaml pnpm-workspace.yaml.bak
        awk '
        /^overrides:/ {
            print
            print "  launchdarkly-js-client-sdk: link:../js-client-sdk"
            in_overrides=1; next
        }
        in_overrides && /^[[:space:]]{2}launchdarkly-js-client-sdk:/ { next }
        in_overrides && !/^[[:space:]]/ { in_overrides=0 }
        { print }
        ' pnpm-workspace.yaml > pnpm-workspace.yaml.tmp && mv pnpm-workspace.yaml.tmp pnpm-workspace.yaml
    else
        log_success "Workspace override already present; no changes needed"
    fi
fi
log_success "Workspace overrides ensured"

# Remove existing node_modules links
rm -rf node_modules/launchdarkly-js-client-sdk 2>/dev/null || true

# Install with workspace overrides
if pnpm install --prefer-offline --silent; then
    log_success "Dependencies installed in toolbar with workspace overrides"
else
    log_error "Failed to install toolbar dependencies"
    exit 1
fi

# Verification step
log_step "Verifying Links"

# Check js-client-sdk → js-sdk-common
if [ -L "$JS_CLIENT_DIR/node_modules/launchdarkly-js-sdk-common" ]; then
    target=$(readlink "$JS_CLIENT_DIR/node_modules/launchdarkly-js-sdk-common")
    log_success "js-client-sdk → js-sdk-common: $target"
else
    log_warning "js-client-sdk → js-sdk-common: Not symlinked"
fi

# React SDK verification removed

# Check toolbar → js-client-sdk
if [ -L "$TOOLBAR_DIR/node_modules/launchdarkly-js-client-sdk" ]; then
    target=$(readlink "$TOOLBAR_DIR/node_modules/launchdarkly-js-client-sdk")
    log_success "toolbar → js-client-sdk: $target"
else
    log_warning "toolbar → js-client-sdk: Not symlinked"
fi

# React SDK verification removed

# Optional build step
if [ "${BUILD:-0}" = "1" ]; then
    log_step "Optional build of SDKs"
    cd "$JS_CLIENT_DIR" && npm run build || true
    cd "$TOOLBAR_DIR"
fi

# Final success message
log_step "Setup Complete!"
echo -e "${GREEN}🎉 Local development links are ready!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "${YELLOW}  1. Start development: ${CYAN}pnpm dev:watch${NC}"
echo -e "${YELLOW}  2. Check status: ${CYAN}pnpm dev:status${NC}"
echo -e "${YELLOW}  3. Make changes to any source file and watch the magic happen!${NC}"
