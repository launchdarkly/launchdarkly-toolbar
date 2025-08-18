#!/bin/bash

# Automatic Local Linking Setup Script
# Sets up the entire local development chain: js-sdk-common -> js-client-sdk -> react-client-sdk -> toolbar

set -e

echo "🔗 Setting up LaunchDarkly Local Development Links..."

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

# Repository paths
JS_COMMON_DIR="$WORKSPACE_DIR/js-sdk-common"
JS_CLIENT_DIR="$WORKSPACE_DIR/js-client-sdk"
REACT_SDK_DIR="$WORKSPACE_DIR/react-client-sdk"
TOOLBAR_DIR="$WORKSPACE_DIR/launchdarkly-toolbar"

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
check_directory "$REACT_SDK_DIR" "react-client-sdk" || exit 1
check_directory "$TOOLBAR_DIR" "launchdarkly-toolbar" || exit 1

# Step 1: Set up js-sdk-common for global linking
log_step "Setting up js-sdk-common for global linking"
cd "$JS_COMMON_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

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

# Step 3: Link js-client-sdk to react-client-sdk
log_step "Linking js-client-sdk → react-client-sdk"
cd "$REACT_SDK_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

# Remove existing node_modules link
rm -rf node_modules/launchdarkly-js-client-sdk 2>/dev/null || true
# Link to local js-client-sdk
if npm link launchdarkly-js-client-sdk; then
    log_success "js-client-sdk linked to react-client-sdk"
else
    log_error "Failed to link js-client-sdk to react-client-sdk"
    exit 1
fi

# Set up react-client-sdk for global linking
if npm link; then
    log_success "react-client-sdk globally linked"
else
    log_error "Failed to globally link react-client-sdk"
    exit 1
fi

# Step 4: Link both SDKs to toolbar (using pnpm)
log_step "Linking SDKs → toolbar (pnpm)"
cd "$TOOLBAR_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

# Remove existing node_modules links
rm -rf node_modules/launchdarkly-js-client-sdk 2>/dev/null || true
rm -rf node_modules/launchdarkly-react-client-sdk 2>/dev/null || true

# Link using pnpm (which should use the package.json link: syntax)
if pnpm install; then
    log_success "Dependencies installed in toolbar (using pnpm link: syntax)"
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

# Check react-client-sdk → js-client-sdk
if [ -L "$REACT_SDK_DIR/node_modules/launchdarkly-js-client-sdk" ]; then
    target=$(readlink "$REACT_SDK_DIR/node_modules/launchdarkly-js-client-sdk")
    log_success "react-client-sdk → js-client-sdk: $target"
else
    log_warning "react-client-sdk → js-client-sdk: Not symlinked"
fi

# Check toolbar → js-client-sdk
if [ -L "$TOOLBAR_DIR/node_modules/launchdarkly-js-client-sdk" ]; then
    target=$(readlink "$TOOLBAR_DIR/node_modules/launchdarkly-js-client-sdk")
    log_success "toolbar → js-client-sdk: $target"
else
    log_warning "toolbar → js-client-sdk: Not symlinked"
fi

# Check toolbar → react-client-sdk
if [ -L "$TOOLBAR_DIR/node_modules/launchdarkly-react-client-sdk" ]; then
    target=$(readlink "$TOOLBAR_DIR/node_modules/launchdarkly-react-client-sdk")
    log_success "toolbar → react-client-sdk: $target"
else
    log_warning "toolbar → react-client-sdk: Not symlinked"
fi

# Final success message
log_step "Setup Complete!"
echo -e "${GREEN}🎉 Local development links are ready!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "${YELLOW}  1. Start development: ${CYAN}pnpm dev:watch${NC}"
echo -e "${YELLOW}  2. Check status: ${CYAN}pnpm dev:status${NC}"
echo -e "${YELLOW}  3. Make changes to any source file and watch the magic happen!${NC}"
