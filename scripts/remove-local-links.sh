#!/bin/bash

# Remove Local Links Script
# Removes all local development links and restores npm registry versions

set -e

echo "🔗 Removing LaunchDarkly Local Development Links..."

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

# Step 1: Remove global links
log_step "Removing Global Links"

echo -e "${BLUE}Removing js-sdk-common global link...${NC}"
cd "$JS_COMMON_DIR" 2>/dev/null && npm unlink 2>/dev/null || true
npm unlink launchdarkly-js-sdk-common -g 2>/dev/null || true
log_success "js-sdk-common global link removed"

echo -e "${BLUE}Removing js-client-sdk global link...${NC}"
cd "$JS_CLIENT_DIR" 2>/dev/null && npm unlink 2>/dev/null || true
npm unlink launchdarkly-js-client-sdk -g 2>/dev/null || true
log_success "js-client-sdk global link removed"

echo -e "${BLUE}Removing react-client-sdk global link...${NC}"
cd "$REACT_SDK_DIR" 2>/dev/null && npm unlink 2>/dev/null || true
npm unlink launchdarkly-react-client-sdk -g 2>/dev/null || true
log_success "react-client-sdk global link removed"

# Step 2: Remove local symlinks and reinstall from npm
log_step "Restoring js-client-sdk dependencies"
cd "$JS_CLIENT_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

# Remove symlinked dependency
rm -rf node_modules/launchdarkly-js-sdk-common 2>/dev/null || true

# Reinstall from npm registry
if npm install launchdarkly-js-sdk-common; then
    log_success "js-client-sdk restored to npm registry version"
else
    log_warning "Could not restore js-client-sdk dependencies"
fi

# Step 3: Restore react-client-sdk dependencies
log_step "Restoring react-client-sdk dependencies"
cd "$REACT_SDK_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

# Remove symlinked dependency
rm -rf node_modules/launchdarkly-js-client-sdk 2>/dev/null || true

# Reinstall from npm registry
if npm install launchdarkly-js-client-sdk; then
    log_success "react-client-sdk restored to npm registry version"
else
    log_warning "Could not restore react-client-sdk dependencies"
fi

# Step 4: Remove workspace overrides and restore toolbar dependencies
log_step "Removing workspace overrides and restoring toolbar dependencies"
cd "$TOOLBAR_DIR"
echo -e "${BLUE}📍 Working in: $(pwd)${NC}"

# Remove overrides from pnpm-workspace.yaml
log_step "Removing workspace overrides from pnpm-workspace.yaml"
if grep -q "overrides:" pnpm-workspace.yaml 2>/dev/null; then
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
rm -rf node_modules/launchdarkly-react-client-sdk 2>/dev/null || true

# Reinstall with registry versions
if pnpm install; then
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

# Check react-client-sdk
if [ -L "$REACT_SDK_DIR/node_modules/launchdarkly-js-client-sdk" ]; then
    log_warning "react-client-sdk still has symlink to js-client-sdk"
else
    log_success "react-client-sdk: No symlinks found"
fi

# Check toolbar
if [ -L "$TOOLBAR_DIR/node_modules/launchdarkly-js-client-sdk" ] || [ -L "$TOOLBAR_DIR/node_modules/launchdarkly-react-client-sdk" ]; then
    log_warning "toolbar still has symlinks"
else
    log_success "toolbar: No symlinks found"
fi

# Final message
log_step "Cleanup Complete!"
echo -e "${GREEN}🎉 Local development links have been removed!${NC}"
echo -e "${BLUE}To restore local linking later:${NC}"
echo -e "${YELLOW}  Run: ${CYAN}pnpm dev:link${NC}"
