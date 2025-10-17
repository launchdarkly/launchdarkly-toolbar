#!/bin/bash

# Remove Local Links Script
# Removes all local development links and restores npm registry versions

set -Eeuo pipefail

echo "🔗 Removing LaunchDarkly Local Development Links..."

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

# Repository paths (configurable)
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
  -w, --workspace <dir>       Override workspace directory
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
            -w|--workspace) WORKSPACE_DIR_OVERRIDE="$2"; shift 2 ;;
            --js-common)    CLI_JS_COMMON_DIR="$2"; shift 2 ;;
            --js-client)    CLI_JS_CLIENT_DIR="$2"; shift 2 ;;

            --toolbar)      CLI_TOOLBAR_DIR="$2"; shift 2 ;;
            -h|--help)      show_help; exit 0 ;;
            *)              log_warning "Unknown arg: $1"; shift ;;
        esac
    done
}

load_config() { :; }

parse_args "$@"

WORKSPACE_DIR="$(resolve_path "${WORKSPACE_DIR_OVERRIDE:-${LD_WORKSPACE_DIR:-$WORKSPACE_DIR}}")"

DEFAULT_JS_COMMON_DIR="$WORKSPACE_DIR/js-sdk-common"
DEFAULT_JS_CLIENT_DIR="$WORKSPACE_DIR/js-client-sdk"

DEFAULT_TOOLBAR_DIR="$WORKSPACE_DIR/launchdarkly-toolbar"

:

JS_COMMON_DIR="$(resolve_path "${CLI_JS_COMMON_DIR:-${LD_JS_COMMON_DIR:-$DEFAULT_JS_COMMON_DIR}}")"
JS_CLIENT_DIR="$(resolve_path "${CLI_JS_CLIENT_DIR:-${LD_JS_CLIENT_DIR:-$DEFAULT_JS_CLIENT_DIR}}")"

TOOLBAR_DIR="$(resolve_path "${CLI_TOOLBAR_DIR:-${LD_TOOLBAR_DIR:-$DEFAULT_TOOLBAR_DIR}}")"

log_step "Effective Directories"
echo -e "${BLUE}WORKSPACE_DIR${NC}: $WORKSPACE_DIR"
echo -e "${BLUE}JS_COMMON_DIR${NC}:  $JS_COMMON_DIR"
echo -e "${BLUE}JS_CLIENT_DIR${NC}:  $JS_CLIENT_DIR"

echo -e "${BLUE}TOOLBAR_DIR${NC}:    $TOOLBAR_DIR"
trap 'log_error "Cleanup failed at line $LINENO"' ERR

# Step 1: Remove global links
log_step "Removing Global Links"

if [ -d "$JS_COMMON_DIR" ]; then
    echo -e "${BLUE}Removing js-sdk-common global link...${NC}"
    cd "$JS_COMMON_DIR" 2>/dev/null && npm unlink 2>/dev/null || true
    npm unlink launchdarkly-js-sdk-common -g 2>/dev/null || true
    log_success "js-sdk-common global link removed"
else
    log_warning "js-sdk-common directory missing; skipping"
fi

if [ -d "$JS_CLIENT_DIR" ]; then
    echo -e "${BLUE}Removing js-client-sdk global link...${NC}"
    cd "$JS_CLIENT_DIR" 2>/dev/null && npm unlink 2>/dev/null || true
    npm unlink launchdarkly-js-client-sdk -g 2>/dev/null || true
    log_success "js-client-sdk global link removed"
else
    log_warning "js-client-sdk directory missing; skipping"
fi



# Step 2: Remove local symlinks and reinstall from npm
if [ -d "$JS_CLIENT_DIR" ]; then
    log_step "Restoring js-client-sdk dependencies"
    cd "$JS_CLIENT_DIR"
    echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

    # Remove symlinked dependency
    rm -rf node_modules/launchdarkly-js-sdk-common 2>/dev/null || true

    # Reinstall from npm registry
    if npm install launchdarkly-js-sdk-common --no-audit --no-fund --silent; then
        log_success "js-client-sdk restored to npm registry version"
    else
        log_warning "Could not restore js-client-sdk dependencies"
    fi
fi



# Step 4: Remove workspace overrides and restore toolbar dependencies
log_step "Removing workspace overrides and restoring toolbar dependencies"
cd "$TOOLBAR_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

# Remove overrides from pnpm-workspace.yaml
log_step "Removing workspace overrides from pnpm-workspace.yaml"
if [ -f pnpm-workspace.yaml ] && grep -q "overrides:" pnpm-workspace.yaml 2>/dev/null; then
    # Create a temporary file without the overrides section
    awk '
    /^overrides:/ { in_overrides=1; next }
    in_overrides && /^[[:space:]]/ { next }
    in_overrides && !/^[[:space:]]/ { in_overrides=0 }
    !in_overrides { print }
    ' pnpm-workspace.yaml > pnpm-workspace.yaml.tmp

    # Replace original with cleaned version
    mv pnpm-workspace.yaml.tmp pnpm-workspace.yaml
    log_success "Workspace overrides removed from pnpm-workspace.yaml"
else
    log_success "No overrides section found in pnpm-workspace.yaml"
fi

# Remove current symlinks
rm -rf node_modules/launchdarkly-js-client-sdk 2>/dev/null || true

# Reinstall with registry versions
if pnpm install --prefer-offline --silent; then
    log_success "Toolbar dependencies restored to registry versions"
else
    log_warning "Could not restore toolbar dependencies"
fi

# Verification step
log_step "Verification"

echo -e "${BLUE}Checking for remaining symlinks...${NC}"

# Check js-client-sdk
if [ -L "$JS_CLIENT_DIR/node_modules/launchdarkly-js-sdk-common" ]; then
    log_warning "js-client-sdk still has symlink to js-sdk-common"
else
    log_success "js-client-sdk: No symlinks found"
fi



# Check toolbar
if [ -L "$TOOLBAR_DIR/node_modules/launchdarkly-js-client-sdk" ]; then
    log_warning "toolbar still has symlinks"
else
    log_success "toolbar: No symlinks found"
fi

# Final message
log_step "Cleanup Complete!"
echo -e "${GREEN}🎉 Local development links have been removed!${NC}"
echo -e "${BLUE}To restore local linking later:${NC}"
echo -e "${YELLOW}  Run: ${CYAN}pnpm dev:link${NC}"
