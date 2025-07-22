#!/bin/bash

# Customer Onboarding Tracker - Automated Installation Script
# This script automates the deployment process on Ubuntu 22.04

set -e  # Exit on any error

echo "=== Customer Onboarding Tracker Deployment Script ==="
echo "Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Node.js version: $NODE_VERSION"
print_status "npm version: $NPM_VERSION"

# Install PM2 globally
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Git
print_status "Installing Git..."
sudo apt install git -y

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p /var/www/onboarding-tracker
sudo chown $USER:$USER /var/www/onboarding-tracker

# Clone or copy application (this would be customized based on your deployment method)
print_status "Setting up application directory..."
cd /var/www/onboarding-tracker

# If you have the application files locally, you would copy them here
# For now, we'll create a placeholder
print_warning "Please copy your application files to /var/www/onboarding-tracker"
print_warning "Then run: npm install && npm run build"

# Create PM2 ecosystem configuration
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'onboarding-tracker',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/onboarding-tracker',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Configure Nginx
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/onboarding-tracker << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/onboarding-tracker /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Configure UFW firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Create backup script
print_status "Creating backup script..."
cat > /home/$USER/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/$USER/backups"
APP_DIR="/var/www/onboarding-tracker"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/onboarding-tracker_$DATE.tar.gz -C $APP_DIR .
echo "Backup created: $BACKUP_DIR/onboarding-tracker_$DATE.tar.gz"

# Keep only last 7 backups
find $BACKUP_DIR -name "onboarding-tracker_*.tar.gz" -mtime +7 -delete
EOF

chmod +x /home/$USER/backup.sh

# Setup cron job for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup.sh") | crontab -

print_status "=== Installation Complete ==="
print_status "Next steps:"
print_status "1. Copy your application files to /var/www/onboarding-tracker"
print_status "2. Run: cd /var/www/onboarding-tracker && npm install && npm run build"
print_status "3. Start the application: pm2 start ecosystem.config.js"
print_status "4. Save PM2 configuration: pm2 save"
print_status "5. Setup PM2 startup: pm2 startup (follow the instructions)"
print_status ""
print_status "Your application will be available at: http://$(curl -s ifconfig.me)"
print_status "Default login: admin@company.com / password"
