#!/bin/bash

# Development Status and Health Check Script
# Shows the status of all repos, links, and running processes

set -e

echo "🏥 LaunchDarkly Development Health Check"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get directories
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE_DIR="$(dirname "$BASE_DIR")"

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

# Repository Health Check
log_section "📁 Repository Structure"
check_directory "$WORKSPACE_DIR/js-sdk-common" "js-sdk-common"
check_directory "$WORKSPACE_DIR/js-client-sdk" "js-client-sdk"
check_directory "$WORKSPACE_DIR/react-client-sdk" "react-client-sdk"
check_directory "$WORKSPACE_DIR/launchdarkly-toolbar" "launchdarkly-toolbar"

# Link Health Check
log_section "🔗 Local Links Status"
check_symlink "$WORKSPACE_DIR/js-client-sdk/node_modules/launchdarkly-js-sdk-common" "js-client → js-common"
check_symlink "$WORKSPACE_DIR/react-client-sdk/node_modules/launchdarkly-js-client-sdk" "react → js-client"
check_symlink "$WORKSPACE_DIR/launchdarkly-toolbar/node_modules/launchdarkly-js-client-sdk" "toolbar → js-client"
check_symlink "$WORKSPACE_DIR/launchdarkly-toolbar/node_modules/launchdarkly-react-client-sdk" "toolbar → react"

# Build Artifacts Check
log_section "🏗️  Build Artifacts"
[ -f "$WORKSPACE_DIR/js-client-sdk/dist/ldclient.cjs.js" ] && echo -e "${GREEN}✅ js-client-sdk build${NC}" || echo -e "${RED}❌ js-client-sdk build${NC}"
[ -f "$WORKSPACE_DIR/react-client-sdk/lib/index.js" ] && echo -e "${GREEN}✅ react-client-sdk build${NC}" || echo -e "${RED}❌ react-client-sdk build${NC}"
[ -f "$WORKSPACE_DIR/launchdarkly-toolbar/dist/js/index.js" ] && echo -e "${GREEN}✅ toolbar build${NC}" || echo -e "${RED}❌ toolbar build${NC}"

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

# Summary
log_section "📋 Quick Actions"
echo -e "${BLUE}Start development:${NC} pnpm dev:smart-watch"
echo -e "${BLUE}Manual rebuild:${NC} pnpm dev:full-rebuild"
echo -e "${BLUE}Restart demo:${NC} pnpm demo:restart"
echo -e "${BLUE}Check status:${NC} pnpm dev:status"

echo -e "\n${CYAN}Health check complete!${NC}"
