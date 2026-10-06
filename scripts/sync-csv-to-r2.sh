#!/bin/bash

# Sync CSV files from /public/data/ to Cloudflare R2
# Usage: ./scripts/sync-csv-to-r2.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== IntElsol CSV to R2 Sync ===${NC}"
echo ""

# Check if R2 token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo -e "${RED}Error: CLOUDFLARE_API_TOKEN environment variable not set${NC}"
  echo "Please set it: export CLOUDFLARE_API_TOKEN=\"your-token-here\""
  exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
  echo -e "${RED}Error: wrangler CLI not found${NC}"
  echo "Install it: npm install -g wrangler"
  exit 1
fi

# Count files
TOTAL_FILES=$(find public/data -name "*.csv" | wc -l | xargs)
echo -e "${BLUE}Found $TOTAL_FILES CSV files to sync${NC}"
echo ""

UPLOADED=0
FAILED=0

# Upload each CSV file
for file in public/data/*.csv; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo -e "${BLUE}Uploading: ${NC}$filename"

    if wrangler r2 object put "intelsol-client-data/data/$filename" --file="$file" > /dev/null 2>&1; then
      echo -e "${GREEN}✓ Success${NC}"
      ((UPLOADED++))
    else
      echo -e "${RED}✗ Failed${NC}"
      ((FAILED++))
    fi
  fi
done

echo ""
echo -e "${BLUE}=== Sync Complete ===${NC}"
echo -e "${GREEN}Uploaded: $UPLOADED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Failed: $FAILED${NC}"
fi

# Calculate total size
TOTAL_SIZE=$(du -sh public/data/*.csv | awk '{sum+=$1} END {print sum}')
echo -e "${BLUE}Total storage: ~10 MB / 10 GB free tier${NC}"
echo ""
