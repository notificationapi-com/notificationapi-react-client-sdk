#!/bin/bash

# Get the version from package.json
VERSION=$(jq -r .version package.json)

# Ensure VERSION is not empty
if [ -z "$VERSION" ]; then
  echo "Error: Version not found in package.json"
  exit 1
fi

# Update the VERSION in api.ts
sed -i.bak "s/\(const VERSION = '\)[^']*\(';\)/\1$VERSION\2/" lib/api.ts

# Verify if VERSION was updated correctly
if grep -q "const VERSION = '$VERSION';" lib/api.ts; then
    echo "Updated VERSION in api.ts to $VERSION"
else
    echo "Failed to update VERSION in api.ts"
fi

# Clean up the backup file created by sed
rm lib/api.ts.bak
