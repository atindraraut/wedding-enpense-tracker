#!/bin/bash

# Wedding Expense Calculator - Next.js Startup Script

echo "================================================"
echo "   Wedding Expense Calculator (Next.js)"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
else
    echo "✓ Dependencies already installed"
    echo ""
fi

echo "================================================"
echo "   Starting Next.js Development Server..."
echo "================================================"
echo ""

# Start Next.js development server
npm run dev
