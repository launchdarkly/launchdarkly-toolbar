#!/bin/bash

# Development Status and Health Check Script
# Shows the status of all repos, links, and running processes

set -Eeuo pipefail

echo "🏥 LaunchDarkly Development Health Check"

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

# Defaults (may be overridden via flags/env/config)
JS_COMMON_DIR=""
JS_CLIENT_DIR=""
TOOLBAR_DIR=""

log_section() {
    echo -e "\n${CYAN}== $1 ==${NC}"
}

check_directory() {
    local dir="$1"
    local name="$2"

    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $name${NC} - Directory exists"
        return 0
    else
        echo -e "${RED}❌ $name${NC} - Directory missing"
        return 1
    fi
}

check_symlink() {
    local link_path="$1"
    local name="$2"

    if [ -L "$link_path" ]; then
        local target=$(readlink "$link_path")
        echo -e "${GREEN}✅ $name${NC} → $target"
        return 0
    elif [ -d "$link_path" ]; then
        echo -e "${YELLOW}⚠️  $name${NC} - Directory exists but not symlinked"
        return 1
    else
        echo -e "${RED}❌ $name${NC} - Not found"
        return 1
    fi
}

check_process() {
    local pattern="$1"
    local name="$2"

    if pgrep -f "$pattern" > /dev/null 2>&1; then
        local pid=$(pgrep -f "$pattern" | head -1)
        echo -e "${GREEN}✅ $name${NC} - Running (PID: $pid)"
        return 0
    else
        echo -e "${RED}❌ $name${NC} - Not running"
        return 1
    fi
}

check_port() {
    local port="$1"
    local name="$2"

    if lsof -i ":$port" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name${NC} - Port $port is active"
        return 0
    else
        echo -e "${RED}❌ $name${NC} - Port $port is not active"
        return 1
    fi
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
            *)              echo -e "${YELLOW}Unknown arg: $1${NC}"; shift ;;
        esac
    done
}

load_config() { :; }

parse_args "$@"

# Allow workspace override
WORKSPACE_DIR="$(resolve_path "${WORKSPACE_DIR_OVERRIDE:-${LD_WORKSPACE_DIR:-$WORKSPACE_DIR}}")"

DEFAULT_JS_COMMON_DIR="$WORKSPACE_DIR/js-sdk-common"
DEFAULT_JS_CLIENT_DIR="$WORKSPACE_DIR/js-client-sdk"

DEFAULT_TOOLBAR_DIR="$WORKSPACE_DIR/launchdarkly-toolbar"

:

JS_COMMON_DIR="$(resolve_path "${CLI_JS_COMMON_DIR:-${LD_JS_COMMON_DIR:-$DEFAULT_JS_COMMON_DIR}}")"
JS_CLIENT_DIR="$(resolve_path "${CLI_JS_CLIENT_DIR:-${LD_JS_CLIENT_DIR:-$DEFAULT_JS_CLIENT_DIR}}")"

TOOLBAR_DIR="$(resolve_path "${CLI_TOOLBAR_DIR:-${LD_TOOLBAR_DIR:-$DEFAULT_TOOLBAR_DIR}}")"

log_section "📍 Effective Directories"
echo -e "${BLUE}WORKSPACE_DIR${NC}: $WORKSPACE_DIR"
echo -e "${BLUE}JS_COMMON_DIR${NC}:  $JS_COMMON_DIR"
echo -e "${BLUE}JS_CLIENT_DIR${NC}:  $JS_CLIENT_DIR"

echo -e "${BLUE}TOOLBAR_DIR${NC}:    $TOOLBAR_DIR"
git_summary() {
    local dir="$1"
    if [ -d "$dir/.git" ]; then
        local branch commit dirty
        branch=$(git -C "$dir" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")
        commit=$(git -C "$dir" rev-parse --short HEAD 2>/dev/null || echo "?")
        if git -C "$dir" diff --quiet --ignore-submodules -- 2>/dev/null; then
            dirty="clean"
        else
            dirty="dirty"
        fi
        echo -e "${BLUE}$(basename "$dir")${NC}: branch=${YELLOW}$branch${NC} commit=${YELLOW}$commit${NC} ${dirty}"
    fi
}

# Repository Health Check
log_section "📁 Repository Structure"
check_directory "$WORKSPACE_DIR/js-sdk-common" "js-sdk-common"
check_directory "$WORKSPACE_DIR/js-client-sdk" "js-client-sdk"

check_directory "$WORKSPACE_DIR/launchdarkly-toolbar" "launchdarkly-toolbar"

log_section "🧭 Git Status"
git_summary "$WORKSPACE_DIR/js-sdk-common"
git_summary "$WORKSPACE_DIR/js-client-sdk"

git_summary "$WORKSPACE_DIR/launchdarkly-toolbar"

# Link Health Check
log_section "🔗 Local Links Status"
check_symlink "$WORKSPACE_DIR/js-client-sdk/node_modules/launchdarkly-js-sdk-common" "js-client → js-common"
check_symlink "$WORKSPACE_DIR/launchdarkly-toolbar/node_modules/launchdarkly-js-client-sdk" "toolbar → js-client"

# Build Artifacts Check
log_section "🏗️  Build Artifacts"
[ -f "$WORKSPACE_DIR/js-client-sdk/dist/ldclient.cjs.js" ] && echo -e "${GREEN}✅ js-client-sdk build${NC}" || echo -e "${RED}❌ js-client-sdk build${NC}"

[ -f "$WORKSPACE_DIR/launchdarkly-toolbar/dist/js/index.js" ] || [ -f "$WORKSPACE_DIR/launchdarkly-toolbar/dist/index.js" ] && echo -e "${GREEN}✅ toolbar build${NC}" || echo -e "${RED}❌ toolbar build${NC}"

# Process Health Check
log_section "🏃 Running Processes"
check_process "fswatch.*src" "File Watcher"
check_process "demo.*dev" "Demo Server"
check_process "vite" "Vite Dev Server"

# Port Health Check
log_section "🌐 Network Ports"
check_port "5173" "Demo (Vite)"
check_port "3001" "Alternative Demo Port"

# Package Manager Check
log_section "📦 Package Managers"
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✅ pnpm${NC} - $(pnpm --version)"
else
    echo -e "${RED}❌ pnpm${NC} - Not installed"
fi

if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ npm${NC} - $(npm --version)"
else
    echo -e "${RED}❌ npm${NC} - Not installed"
fi

if command -v fswatch &> /dev/null; then
    echo -e "${GREEN}✅ fswatch${NC} - Available"
else
    echo -e "${RED}❌ fswatch${NC} - Not installed (brew install fswatch)"
fi

log_section "🧰 Node & Tooling"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ node${NC} - $(node -v)"
else
    echo -e "${RED}❌ node${NC} - Not installed"
fi
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ npm${NC} - $(npm -v)"
else
    echo -e "${RED}❌ npm${NC} - Not installed"
fi

# Summary
log_section "📋 Quick Actions"
echo -e "${BLUE}Start development:${NC} pnpm dev:smart-watch"
echo -e "${BLUE}Manual rebuild:${NC} pnpm dev:full-rebuild"
echo -e "${BLUE}Restart demo:${NC} pnpm demo:restart"
echo -e "${BLUE}Check status:${NC} pnpm dev:status"

echo -e "\n${CYAN}Health check complete!${NC}"
