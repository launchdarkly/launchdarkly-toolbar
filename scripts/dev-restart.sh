#!/bin/bash

# Development Restart Script
# Kills the current demo and starts a fresh one

set -e

echo "🔄 Restarting LaunchDarkly Toolbar Demo..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Base directory (assuming script is in toolbar/scripts/)
BASE_DIR="$(dirname "$(dirname "$(realpath "$0")")")"

cd "$BASE_DIR"

# Kill existing demo processes
echo -e "${YELLOW}🛑 Stopping existing demo...${NC}"
pkill -f "pnpm.*demo" 2>/dev/null || echo "No demo process found"
sleep 1

# Start fresh demo
echo -e "${YELLOW}🚀 Starting demo...${NC}"
pnpm demo:dev &

echo -e "${GREEN}✅ Demo restarted!${NC}"
echo -e "${YELLOW}🌐 Demo should be available at: http://localhost:3001${NC}"
