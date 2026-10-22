#!/bin/bash

# Create directories
mkdir -p app/pluritech
mkdir -p public/tasks
mkdir -p public/uploads/pluritech
mkdir -p public/sequences
mkdir -p public/campaigns

# Create empty JSON files
echo "[]" > public/tasks/pluritech.json
echo "[]" > public/uploads/pluritech/.metadata.json
echo "[]" > public/sequences/pluritech.json
echo "[]" > public/campaigns/pluritech.json

echo "✓ Created directory structure and JSON files"
