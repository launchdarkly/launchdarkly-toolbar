#!/bin/bash

# Simple Smart File Watcher with Debouncing
# Compatible version that works with all shells

set -e

echo "🧠 Starting Smart LaunchDarkly Watcher..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
DEBOUNCE_TIME=2
REBUILD_IN_PROGRESS=false
LAST_CHANGE_TIME=0

# Check dependencies
if ! command -v fswatch &> /dev/null; then
    echo -e "${RED}❌ fswatch is not installed${NC}"
    echo -e "${YELLOW}💡 Install with: brew install fswatch${NC}"
    exit 1
fi

# Get directories
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE_DIR="$(dirname "$BASE_DIR")"

# Define watch directories
JS_COMMON_SRC="$WORKSPACE_DIR/js-sdk-common/src"
JS_CLIENT_SRC="$WORKSPACE_DIR/js-client-sdk/src"
TOOLBAR_SRC="$WORKSPACE_DIR/launchdarkly-toolbar/src"
DEMO_SRC="$WORKSPACE_DIR/launchdarkly-toolbar/demo/src"

# Functions
log_with_time() {
    echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"
}

get_current_time() {
    date +%s
}

build_js_client() {
    log_with_time "${BLUE}📦 Building js-client-sdk...${NC}"
    cd "$WORKSPACE_DIR/js-client-sdk"
    if npm run build > /dev/null 2>&1; then
        log_with_time "${GREEN}✅ js-client-sdk built${NC}"
        return 0
    else
        log_with_time "${RED}❌ js-client-sdk build failed${NC}"
        return 1
    fi
}



build_toolbar() {
    log_with_time "${BLUE}📦 Building toolbar...${NC}"
    cd "$WORKSPACE_DIR/launchdarkly-toolbar"
    if pnpm build > /dev/null 2>&1; then
        log_with_time "${GREEN}✅ toolbar built${NC}"
        return 0
    else
        log_with_time "${RED}❌ toolbar build failed${NC}"
        return 1
    fi
}

restart_demo() {
    log_with_time "${PURPLE}🔄 Restarting demo...${NC}"
    if "$SCRIPT_DIR/dev-restart.sh" > /dev/null 2>&1; then
        log_with_time "${GREEN}🚀 Demo restarted${NC}"
        return 0
    else
        log_with_time "${RED}❌ Demo restart failed${NC}"
        return 1
    fi
}

is_port_active() {
    local port="$1"
    lsof -i ":$port" > /dev/null 2>&1
}

smart_rebuild() {
    local changed_file="$1"

    # Determine what needs to be rebuilt based on changed file
    case "$changed_file" in
        *"js-sdk-common/src"*)
            log_with_time "${YELLOW}🔧 js-sdk-common changed → rebuilding js-client + toolbar${NC}"
            build_js_client && build_toolbar && restart_demo
            ;;
        *"js-client-sdk/src"*)
            log_with_time "${YELLOW}🔧 js-client-sdk changed → rebuilding js-client + toolbar${NC}"
            build_js_client && build_toolbar && restart_demo
            ;;
        *"launchdarkly-toolbar/src"*)
            log_with_time "${YELLOW}🔧 toolbar changed → rebuilding toolbar only${NC}"
            build_toolbar && restart_demo
            ;;
        *"launchdarkly-toolbar/demo/src"*)
            log_with_time "${BLUE}🌀 demo changed → handled by Vite HMR (no rebuild)${NC}"
            ;;
        *)
            log_with_time "${RED}❌ Unknown change location: $changed_file${NC}"
            return 1
            ;;
    esac
}

debounced_rebuild() {
    local changed_file="$1"
    local current_time
    current_time=$(get_current_time)

    # Update last change time
    LAST_CHANGE_TIME=$current_time

    # Show immediate feedback
    local rel_file="${changed_file#$WORKSPACE_DIR/}"
    log_with_time "${YELLOW}📝 Change detected: ${rel_file}${NC}"

    # Wait for debounce period
    sleep $DEBOUNCE_TIME

    # Check if this is still the latest change
    if [ "$LAST_CHANGE_TIME" -eq "$current_time" ] && [ "$REBUILD_IN_PROGRESS" = false ]; then
        REBUILD_IN_PROGRESS=true

        local start_time=$(get_current_time)
        if smart_rebuild "$changed_file"; then
            local end_time=$(get_current_time)
            local duration=$((end_time - start_time))
            log_with_time "${GREEN}🎉 Rebuild complete in ${duration}s${NC}"
        else
            log_with_time "${RED}💥 Rebuild failed${NC}"
        fi

        REBUILD_IN_PROGRESS=false
    fi
}

# Cleanup function
cleanup() {
    log_with_time "${YELLOW}🛑 Stopping watcher...${NC}"
    jobs -p | xargs -r kill 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Display startup info
log_with_time "${BLUE}📁 Watching directories:${NC}"
[ -d "$JS_COMMON_SRC" ] && log_with_time "${BLUE}  👀 js-sdk-common → rebuilds entire chain${NC}" || log_with_time "${RED}  ❌ js-sdk-common (not found)${NC}"
[ -d "$JS_CLIENT_SRC" ] && log_with_time "${BLUE}  👀 js-client-sdk → rebuilds js-client + react + toolbar${NC}" || log_with_time "${RED}  ❌ js-client-sdk (not found)${NC}"
[ -d "$TOOLBAR_SRC" ] && log_with_time "${BLUE}  👀 toolbar → rebuilds toolbar only${NC}" || log_with_time "${RED}  ❌ toolbar (not found)${NC}"
[ -d "$DEMO_SRC" ] && log_with_time "${BLUE}  👀 demo → HMR via Vite, no rebuild${NC}" || log_with_time "${RED}  ❌ demo (not found)${NC}"

log_with_time "${YELLOW}🔄 Debounce time: ${DEBOUNCE_TIME}s${NC}"
log_with_time "${GREEN}💡 Press Ctrl+C to stop${NC}"
log_with_time "${CYAN}Ready for changes...${NC}"

# Ensure demo server is running for HMR
if ! is_port_active 5173; then
    log_with_time "${YELLOW}🌐 Demo server not detected on :5173, starting it...${NC}"
    restart_demo || true
fi

# Watch for changes
fswatch -r --event Created --event Updated --event Renamed \
    "$JS_COMMON_SRC" "$JS_CLIENT_SRC" "$TOOLBAR_SRC" "$DEMO_SRC" | while read changed_file; do

    # Skip temporary files and build artifacts
    case "$changed_file" in
        *.tmp|*.swp|*.swo|*/.git/*|*/node_modules/*|*/dist/*|*/lib/*)
            continue
            ;;
    esac

    # Run debounced rebuild in background
    debounced_rebuild "$changed_file" &
done
