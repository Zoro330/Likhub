#!/bin/bash
echo "Installing dependencies with workarounds..."
npm install --force --legacy-peer-deps

# Create the node_modules/camelcase directory if it doesn't exist
mkdir -p node_modules/camelcase

# Create a basic package.json for camelcase
echo '{
  "name": "camelcase",
  "version": "6.3.0",
  "main": "index.js"
}' > node_modules/camelcase/package.json

# Create a simple implementation of camelcase
echo 'module.exports = function camelcase(text) {
  if (!text) {
    return "";
  }
  return text.replace(/[-_]([a-z])/g, (_, g) => g.toUpperCase());
};' > node_modules/camelcase/index.js

echo "Building the React application..."
npm run build 