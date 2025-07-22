#!/bin/bash

# Customer Onboarding Tracker - Update Script
# This script handles application updates

set -e

echo "=== Application Update Script ==="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

APP_DIR="/var/www/onboarding-tracker"

# Create backup before update
print_status "Creating backup before update..."
/home/$USER/backup.sh

# Stop the application
print_status "Stopping application..."
pm2 stop onboarding-tracker

# Navigate to application directory
cd $APP_DIR

# Pull latest changes (if using git)
print_status "Pulling latest changes..."
git pull origin main

# Install/update dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building application..."
npm run build

# Start the application
print_status "Starting application..."
pm2 start onboarding-tracker

print_status "Update completed successfully!"
print_status "Application is running at: http://$(curl -s ifconfig.me)"
