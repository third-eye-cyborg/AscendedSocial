#!/bin/bash
set -e

echo "🔮 Initializing Ascended Social Codespace..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Setting up environment...${NC}"

# Create necessary directories
mkdir -p logs
mkdir -p .cache
mkdir -p .local

# Check if .env exists, if not create from template
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env from template...${NC}"
    if [ -f .env_example ]; then
        cp .env_example .env
        echo -e "${GREEN}✓ .env created${NC}"
    elif [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env created${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env template found, creating minimal .env${NC}"
        cat > .env << EOF
# Development Environment Variables
NODE_ENV=development
DEBUG=*
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ascended_social
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/ascended_social
EOF
    fi
fi

echo -e "${GREEN}✓ Environment setup complete${NC}"
echo -e "${BLUE}🎉 Codespace initialization complete!${NC}"
echo ""
echo -e "${GREEN}Quick Start:${NC}"
echo "  npm run dev          - Start development server"
echo "  npm run dev:client   - Frontend only"
echo "  npm run dev:server   - Backend only"
echo "  npm run db:push      - Push database schema"
echo "  npm run test:visual:all - Run all tests"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  - README.md - Project overview"
echo "  - replit.md - Replit-specific info"
echo "  - docs/ - Full documentation"
echo ""
