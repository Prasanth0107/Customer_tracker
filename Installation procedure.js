You're right! Let me provide you with the complete step-by-step commands and procedures for deploying the Customer Onboarding Tracker application on AWS.
## **Technology Stack**

- **Frontend**: React with Next.js App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with localStorage persistence
- **Icons**: Lucide React icons

## **Complete AWS Deployment Guide with Commands**

### **Phase 1: AWS Infrastructure Setup**

#### **Step 1: Launch EC2 Instance**

```shellscript
# Option A: Using AWS Console (Recommended for beginners)
# 1. Go to AWS Console → EC2 → Launch Instance
# 2. Choose Ubuntu Server 22.04 LTS
# 3. Select t3.medium instance type
# 4. Create/select key pair
# 5. Configure security group (see below)
# 6. Launch instance

# Option B: Using AWS CLI
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --instance-type t3.medium \
    --key-name your-key-pair-name \
    --security-group-ids sg-xxxxxxxxx \
    --subnet-id subnet-xxxxxxxxx \
    --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":20,"VolumeType":"gp3"}}]' \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=OnboardingTracker}]'
```

#### **Step 2: Configure Security Group**

```shellscript
# Create security group
aws ec2 create-security-group \
    --group-name onboarding-tracker-sg \
    --description "Security group for Onboarding Tracker"

# Add inbound rules
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 22 \
    --cidr YOUR_IP_ADDRESS/32

aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0
```

#### **Step 3: Allocate Elastic IP**

```shellscript
# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

# Associate with instance (replace with your instance ID and allocation ID)
aws ec2 associate-address \
    --instance-id i-xxxxxxxxx \
    --allocation-id eipalloc-xxxxxxxxx
```

### **Phase 2: Connect and Setup Server**

#### **Step 4: Connect to EC2 Instance**

```shellscript
# SSH into your instance (replace with your key file and IP)
ssh -i your-key-pair.pem ubuntu@YOUR_ELASTIC_IP

# Update system packages
sudo apt update && sudo apt upgrade -y
```

#### **Step 5: Install Node.js 18.x**

```shellscript
# Download and install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show v9.x.x
```

#### **Step 6: Install PM2 Process Manager**

```shellscript
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

#### **Step 7: Install Nginx**

```shellscript
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

#### **Step 8: Install Additional Tools**

```shellscript
# Install Git
sudo apt install git -y

# Install unzip (for file extraction)
sudo apt install unzip -y

# Install htop (for monitoring)
sudo apt install htop -y
```

### **Phase 3: Deploy Application**

#### **Step 9: Create Application Directory**

```shellscript
# Create application directory
sudo mkdir -p /var/www/onboarding-tracker
sudo chown ubuntu:ubuntu /var/www/onboarding-tracker

# Navigate to directory
cd /var/www/onboarding-tracker
```

#### **Step 10: Deploy Application Files**

**Option A: If you have the code in a Git repository**

```shellscript
# Clone repository
git clone https://github.com/your-username/onboarding-tracker.git .
```

**Option B: If you have local files (run from your local machine)**

```shellscript
# From your local machine, copy files to server
scp -i your-key-pair.pem -r ./onboarding-tracker/* ubuntu@YOUR_ELASTIC_IP:/var/www/onboarding-tracker/
```

**Option C: Manual file creation (if you want to create files directly)**

```shellscript
# Create package.json
cat > package.json << 'EOF'
{
  "name": "onboarding-tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
EOF

# You would then need to create all the component files...
# For brevity, I'll show the key commands to copy from the previous code project
```

#### **Step 11: Install Dependencies and Build**

```shellscript
# Navigate to application directory
cd /var/www/onboarding-tracker

# Install dependencies
npm install

# Build the application
npm run build
```

#### **Step 12: Create PM2 Configuration**

```shellscript
# Create PM2 ecosystem file
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
```

#### **Step 13: Start Application with PM2**

```shellscript
# Start application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs onboarding-tracker

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command that PM2 provides
```

### **Phase 4: Configure Nginx Reverse Proxy**

#### **Step 14: Configure Nginx**

```shellscript
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/onboarding-tracker << 'EOF'
server {
    listen 80;
    server_name _;  # Use your domain name here if you have one

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
sudo ln -s /etc/nginx/sites-available/onboarding-tracker /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **Phase 5: Configure Firewall**

#### **Step 15: Setup UFW Firewall**

```shellscript
# Enable UFW
sudo ufw --force enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

### **Phase 6: SSL Configuration (Optional but Recommended)**

#### **Step 16: Install SSL Certificate**

```shellscript
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### **Phase 7: Setup Monitoring and Backups**

#### **Step 17: Create Backup Script**

```shellscript
# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
APP_DIR="/var/www/onboarding-tracker"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/onboarding-tracker_$DATE.tar.gz -C $APP_DIR .
echo "Backup created: $BACKUP_DIR/onboarding-tracker_$DATE.tar.gz"

# Keep only last 7 backups
find $BACKUP_DIR -name "onboarding-tracker_*.tar.gz" -mtime +7 -delete
EOF

# Make script executable
chmod +x /home/ubuntu/backup.sh

# Test backup script
/home/ubuntu/backup.sh
```

#### **Step 18: Setup Automated Backups**

```shellscript
# Setup cron job for daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh") | crontab -

# Verify cron job
crontab -l
```

### **Phase 8: Verification and Testing**

#### **Step 19: Test Application**

```shellscript
# Check if application is running
pm2 status

# Check application logs
pm2 logs onboarding-tracker

# Test HTTP access
curl http://localhost:3000

# Check Nginx status
sudo systemctl status nginx

# Check if ports are listening
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

#### **Step 20: Access Application**

```shellscript
# Get your public IP
curl ifconfig.me

# Access application in browser:
# http://YOUR_ELASTIC_IP
# or
# https://your-domain.com (if SSL configured)
```

## **Useful Management Commands**

### **Application Management**

```shellscript
# Restart application
pm2 restart onboarding-tracker

# Stop application
pm2 stop onboarding-tracker

# View real-time logs
pm2 logs onboarding-tracker --lines 100

# Monitor application
pm2 monit
```

### **Server Management**

```shellscript
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Update Application**

```shellscript
# Stop application
pm2 stop onboarding-tracker

# Navigate to app directory
cd /var/www/onboarding-tracker

# Pull latest changes (if using git)
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Start application
pm2 start onboarding-tracker
```

## **Quick Deployment Checklist**

1. ✅ Launch EC2 instance (t3.medium, Ubuntu 22.04)
2. ✅ Configure security group (ports 22, 80, 443)
3. ✅ Allocate and associate Elastic IP
4. ✅ SSH into instance
5. ✅ Update system packages
6. ✅ Install Node.js 18.x
7. ✅ Install PM2
8. ✅ Install Nginx
9. ✅ Create application directory
10. ✅ Deploy application files
11. ✅ Install dependencies and build
12. ✅ Configure PM2
13. ✅ Start application with PM2
14. ✅ Configure Nginx reverse proxy
15. ✅ Setup firewall
16. ✅ Configure SSL (optional)
17. ✅ Setup backups
18. ✅ Test application access


## **Default Access Information**

- **Application URL**: `http://YOUR_ELASTIC_IP`
- **Default Login Credentials**:

- Super Admin: `admin@company.com` / `password`
- Normal User: `user@company.com` / `password`





## **Estimated Monthly Cost**

- EC2 t3.medium: ~$30.37
- EBS Storage (20GB): ~$2.40
- Elastic IP: ~$3.65
- **Total**: ~$36-42/month


This complete guide provides all the commands and steps needed to deploy your Customer Onboarding Tracker application on AWS!
