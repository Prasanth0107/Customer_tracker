# Customer Onboarding Tracker - AWS Deployment Guide

## Executive Summary

This document outlines the complete deployment procedure for the Customer Onboarding Tracker application on Amazon Web Services (AWS). The application is a React-based web application built with Next.js that provides secure, role-based customer onboarding management capabilities.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Infrastructure Requirements](#aws-infrastructure-requirements)
3. [Cost Estimation](#cost-estimation)
4. [Security Considerations](#security-considerations)
5. [Step-by-Step Deployment Process](#step-by-step-deployment-process)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Backup and Recovery](#backup-and-recovery)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required AWS Services
- **EC2 Instance** (t3.medium or higher recommended)
- **Security Groups** (for firewall configuration)
- **Elastic IP** (for static IP address)
- **Route 53** (optional, for custom domain)
- **Certificate Manager** (optional, for SSL/TLS)

### Required Software Stack
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **PM2** (Process Manager)
- **Nginx** (Reverse Proxy)
- **Git** (Version Control)

### Access Requirements
- AWS Account with appropriate permissions
- SSH Key Pair for EC2 access
- Domain name (optional, for production setup)

## AWS Infrastructure Requirements

### EC2 Instance Specifications
- **Instance Type**: t3.medium (2 vCPU, 4 GB RAM)
- **Storage**: 20 GB GP3 SSD
- **Operating System**: Ubuntu 22.04 LTS
- **Network**: VPC with public subnet
- **Security Group**: Custom rules for HTTP/HTTPS/SSH

### Security Group Configuration
\`\`\`
Inbound Rules:
- SSH (22): Your IP address
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
- Custom TCP (3000): 0.0.0.0/0 (for development)

Outbound Rules:
- All traffic: 0.0.0.0/0
\`\`\`

## Cost Estimation

### Monthly AWS Costs (US East-1)
- **EC2 t3.medium**: ~$30.37/month
- **EBS Storage (20 GB)**: ~$2.40/month
- **Elastic IP**: ~$3.65/month
- **Data Transfer**: ~$5-10/month
- **Total Estimated Cost**: ~$41-46/month

*Note: Costs may vary based on usage and region*

## Security Considerations

### Application Security
- Role-based access control (Super Admin, Normal User)
- Session management with localStorage
- Input validation and sanitization
- HTTPS encryption (recommended for production)

### Infrastructure Security
- Security Groups acting as virtual firewall
- SSH key-based authentication
- Regular security updates
- Nginx reverse proxy for additional security layer

## Step-by-Step Deployment Process

### Phase 1: AWS Infrastructure Setup

#### Step 1: Launch EC2 Instance
\`\`\`bash
# Using AWS CLI (alternative to console)
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --instance-type t3.medium \
    --key-name your-key-pair \
    --security-group-ids sg-xxxxxxxxx \
    --subnet-id subnet-xxxxxxxxx \
    --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":20,"VolumeType":"gp3"}}]' \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=OnboardingTracker}]'
\`\`\`

#### Step 2: Allocate and Associate Elastic IP
\`\`\`bash
# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

# Associate with instance
aws ec2 associate-address \
    --instance-id i-xxxxxxxxx \
    --allocation-id eipalloc-xxxxxxxxx
\`\`\`

### Phase 2: Server Configuration

#### Step 3: Connect to EC2 Instance
\`\`\`bash
# SSH into the instance
ssh -i your-key-pair.pem ubuntu@your-elastic-ip

# Update system packages
sudo apt update && sudo apt upgrade -y
\`\`\`

#### Step 4: Install Node.js and npm
\`\`\`bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show v9.x.x
\`\`\`

#### Step 5: Install PM2 Process Manager
\`\`\`bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
\`\`\`

#### Step 6: Install and Configure Nginx
\`\`\`bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
\`\`\`

#### Step 7: Install Git
\`\`\`bash
# Install Git
sudo apt install git -y

# Verify installation
git --version
\`\`\`

### Phase 3: Application Deployment

#### Step 8: Clone Application Repository
\`\`\`bash
# Create application directory
sudo mkdir -p /var/www/onboarding-tracker
sudo chown ubuntu:ubuntu /var/www/onboarding-tracker

# Navigate to directory
cd /var/www/onboarding-tracker

# Clone repository (replace with your actual repository)
git clone https://github.com/your-username/onboarding-tracker.git .

# Or if deploying from local files, use SCP:
# scp -i your-key-pair.pem -r ./onboarding-tracker ubuntu@your-elastic-ip:/var/www/
\`\`\`

#### Step 9: Install Application Dependencies
\`\`\`bash
# Navigate to application directory
cd /var/www/onboarding-tracker

# Install dependencies
npm install

# Build the application
npm run build
\`\`\`

#### Step 10: Configure PM2 for Application
\`\`\`bash
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

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
\`\`\`

#### Step 11: Configure Nginx Reverse Proxy
\`\`\`bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/onboarding-tracker << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or use _ for any domain

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
\`\`\`

### Phase 4: SSL/TLS Configuration (Optional but Recommended)

#### Step 12: Install Certbot for Let's Encrypt SSL
\`\`\`bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
\`\`\`

### Phase 5: Firewall Configuration

#### Step 13: Configure UFW Firewall
\`\`\`bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
\`\`\`

## Post-Deployment Configuration

### Application Access
- **HTTP**: http://your-elastic-ip or http://your-domain.com
- **HTTPS**: https://your-domain.com (if SSL configured)

### Default Login Credentials
- **Super Admin**: admin@company.com / password
- **Normal User**: user@company.com / password

### Environment Variables (if needed)
\`\`\`bash
# Create .env.local file
cd /var/www/onboarding-tracker
cat > .env.local << 'EOF'
NODE_ENV=production
PORT=3000
# Add other environment variables as needed
EOF

# Restart application
pm2 restart onboarding-tracker
\`\`\`

## Monitoring and Maintenance

### PM2 Monitoring Commands
\`\`\`bash
# Check application status
pm2 status

# View logs
pm2 logs onboarding-tracker

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart onboarding-tracker
\`\`\`

### System Monitoring
\`\`\`bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check Nginx status
sudo systemctl status nginx
\`\`\`

### Log Files Locations
- **Application Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `/var/log/syslog`

## Backup and Recovery

### Application Backup
\`\`\`bash
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

chmod +x /home/ubuntu/backup.sh

# Setup cron job for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh") | crontab -
\`\`\`

### Recovery Process
\`\`\`bash
# Stop application
pm2 stop onboarding-tracker

# Restore from backup
cd /var/www
sudo rm -rf onboarding-tracker
sudo mkdir onboarding-tracker
sudo tar -xzf /home/ubuntu/backups/onboarding-tracker_YYYYMMDD_HHMMSS.tar.gz -C onboarding-tracker
sudo chown -R ubuntu:ubuntu onboarding-tracker

# Restart application
pm2 start onboarding-tracker
\`\`\`

## Troubleshooting

### Common Issues and Solutions

#### Application Not Starting
\`\`\`bash
# Check PM2 logs
pm2 logs onboarding-tracker

# Check if port 3000 is in use
sudo netstat -tlnp | grep :3000

# Restart PM2
pm2 restart onboarding-tracker
\`\`\`

#### Nginx Issues
\`\`\`bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
\`\`\`

#### SSL Certificate Issues
\`\`\`bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -t
\`\`\`

### Performance Optimization

#### Enable Gzip Compression
\`\`\`bash
# Add to Nginx configuration
sudo tee -a /etc/nginx/sites-available/onboarding-tracker << 'EOF'

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
EOF

sudo systemctl restart nginx
\`\`\`

#### PM2 Cluster Mode (for high traffic)
\`\`\`bash
# Update ecosystem.config.js for cluster mode
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'onboarding-tracker',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/onboarding-tracker',
    instances: 'max',  # Use all CPU cores
    exec_mode: 'cluster',
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

pm2 reload ecosystem.config.js
\`\`\`

## Deployment Checklist

### Pre-Deployment
- [ ] AWS account setup and permissions verified
- [ ] SSH key pair created and downloaded
- [ ] Domain name registered (if using custom domain)
- [ ] Security requirements reviewed

### Infrastructure Setup
- [ ] EC2 instance launched and configured
- [ ] Security groups configured
- [ ] Elastic IP allocated and associated
- [ ] SSH access verified

### Software Installation
- [ ] System packages updated
- [ ] Node.js and npm installed
- [ ] PM2 installed
- [ ] Nginx installed and configured
- [ ] Git installed

### Application Deployment
- [ ] Application code deployed
- [ ] Dependencies installed
- [ ] Application built successfully
- [ ] PM2 configuration created
- [ ] Application started with PM2
- [ ] Nginx reverse proxy configured

### Security Configuration
- [ ] Firewall configured
- [ ] SSL certificate installed (if applicable)
- [ ] Security groups reviewed
- [ ] Access controls verified

### Testing and Validation
- [ ] Application accessible via HTTP/HTTPS
- [ ] Login functionality tested
- [ ] All features working correctly
- [ ] Performance acceptable
- [ ] Logs monitoring setup

### Documentation and Handover
- [ ] Deployment documentation completed
- [ ] Access credentials documented
- [ ] Monitoring procedures established
- [ ] Backup procedures implemented
- [ ] Team training completed

## Support and Maintenance

### Regular Maintenance Tasks
- **Weekly**: Check application logs and performance
- **Monthly**: Update system packages and security patches
- **Quarterly**: Review and update SSL certificates
- **Annually**: Review and update security configurations

### Emergency Contacts
- **AWS Support**: Available through AWS Console
- **Application Support**: [Your team contact information]
- **Infrastructure Team**: [Your infrastructure team contact]

## Conclusion

This deployment guide provides a comprehensive approach to deploying the Customer Onboarding Tracker application on AWS. Following these steps will result in a secure, scalable, and maintainable production environment.

For any questions or issues during deployment, please refer to the troubleshooting section or contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Prepared By**: [Your Name]  
**Approved By**: [Manager Name]
