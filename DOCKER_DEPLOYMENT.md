# Docker Deployment Guide for Magazine Frontend

## 🐳 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Create `.env` file** (copy from `.env.example`):
```bash
cp Magz-master/.env.example .env
```

2. **Edit `.env` with your Strapi credentials**:
```env
STRAPI_API_URL=https://management.evborne.ma
STRAPI_API_TOKEN=your_actual_token_here
DEFAULT_LANGUAGE=fr
ARTICLES_PER_PAGE=10
HOMEPAGE_FEATURED=6
SIDEBAR_RECENT=5
```

3. **Build and run**:
```bash
docker-compose up -d
```

4. **Access your magazine**:
```
http://localhost:8080
```

### Option 2: Using Docker directly

1. **Build the image**:
```bash
docker build -t evplug-magazine:latest .
```

2. **Run the container**:
```bash
docker run -d \
  --name evplug-magazine \
  -p 8080:80 \
  -e STRAPI_API_URL=https://management.evborne.ma \
  -e STRAPI_API_TOKEN=your_token_here \
  -e DEFAULT_LANGUAGE=fr \
  evplug-magazine:latest
```

3. **Access your magazine**:
```
http://localhost:8080
```

## 📦 Docker Commands

### Build
```bash
# Build the image
docker build -t evplug-magazine:latest .

# Build with specific tag
docker build -t evplug-magazine:v1.0.0 .

# Build without cache
docker build --no-cache -t evplug-magazine:latest .
```

### Run
```bash
# Run with environment variables
docker run -d \
  --name evplug-magazine \
  -p 8080:80 \
  --restart unless-stopped \
  -e STRAPI_API_URL=https://management.evborne.ma \
  -e STRAPI_API_TOKEN=your_token_here \
  evplug-magazine:latest

# Run with env file
docker run -d \
  --name evplug-magazine \
  -p 8080:80 \
  --env-file .env \
  evplug-magazine:latest
```

### Manage
```bash
# View logs
docker logs evplug-magazine
docker logs -f evplug-magazine  # Follow logs

# Stop container
docker stop evplug-magazine

# Start container
docker start evplug-magazine

# Restart container
docker restart evplug-magazine

# Remove container
docker rm -f evplug-magazine

# View container stats
docker stats evplug-magazine

# Execute command in container
docker exec -it evplug-magazine sh
```

## 🚀 Production Deployment

### 1. Environment Configuration

Create a production `.env` file:
```env
# Production Strapi Configuration
STRAPI_API_URL=https://api.yourdomain.com
STRAPI_API_TOKEN=your_production_token

# Application Settings
DEFAULT_LANGUAGE=fr
ARTICLES_PER_PAGE=10
HOMEPAGE_FEATURED=6
SIDEBAR_RECENT=5
```

### 2. Deploy with Docker Compose

```bash
# Pull latest changes
git pull origin main

# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f magazine-frontend

# Check health
docker-compose ps
```

### 3. Behind a Reverse Proxy (Nginx/Traefik)

#### Using Nginx as reverse proxy:

Create `nginx-proxy.conf`:
```nginx
server {
    listen 80;
    server_name magazine.yourdomain.com;

    location / {
        proxy_pass http://magazine-frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Using Traefik labels in docker-compose.yml:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.magazine.rule=Host(`magazine.yourdomain.com`)"
  - "traefik.http.routers.magazine.entrypoints=websecure"
  - "traefik.http.routers.magazine.tls.certresolver=letsencrypt"
```

### 4. SSL/HTTPS Configuration

Use Let's Encrypt with Certbot:
```bash
# Install certbot
apt-get update && apt-get install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d magazine.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `STRAPI_API_URL` | Strapi backend URL | `https://management.evborne.ma` |
| `STRAPI_API_TOKEN` | Strapi API authentication token | Required |
| `DEFAULT_LANGUAGE` | Default content language (fr/ar/en) | `fr` |
| `ARTICLES_PER_PAGE` | Number of articles per page | `10` |
| `HOMEPAGE_FEATURED` | Featured articles on homepage | `6` |
| `SIDEBAR_RECENT` | Recent articles in sidebar | `5` |

### Port Mapping

Change the port by modifying the `-p` parameter:
```bash
# Run on port 3000 instead of 8080
docker run -d -p 3000:80 evplug-magazine:latest

# Run on port 80 (requires root/admin)
docker run -d -p 80:80 evplug-magazine:latest
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
The container includes a built-in health check:
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' evplug-magazine

# View health check logs
docker inspect evplug-magazine | jq '.[0].State.Health'
```

### Container Metrics
```bash
# Real-time stats
docker stats evplug-magazine

# Resource usage
docker container inspect evplug-magazine | jq '.[0].HostConfig.Memory'
```

## 🔄 Updates & Maintenance

### Update the Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or with Docker
docker build -t evplug-magazine:latest .
docker stop evplug-magazine
docker rm evplug-magazine
docker run -d --name evplug-magazine -p 8080:80 --env-file .env evplug-magazine:latest
```

### Backup Configuration
```bash
# Backup environment variables
cp .env .env.backup.$(date +%Y%m%d)

# Export Docker image
docker save evplug-magazine:latest | gzip > evplug-magazine-latest.tar.gz

# Import on another server
docker load < evplug-magazine-latest.tar.gz
```

## 🐛 Troubleshooting

### Check Container Logs
```bash
docker logs evplug-magazine
docker logs --tail 100 evplug-magazine  # Last 100 lines
docker logs --since 30m evplug-magazine # Last 30 minutes
```

### Access Container Shell
```bash
docker exec -it evplug-magazine sh

# Check nginx config
nginx -t

# Check files
ls -la /usr/share/nginx/html/
cat /usr/share/nginx/html/js/strapi-config.js
```

### Common Issues

**Container won't start:**
```bash
# Check logs
docker logs evplug-magazine

# Verify environment variables
docker exec evplug-magazine env | grep STRAPI
```

**Strapi connection fails:**
```bash
# Test connection from container
docker exec evplug-magazine wget -O- https://management.evborne.ma/api/articles

# Check network
docker exec evplug-magazine ping -c 3 management.evborne.ma
```

**Port already in use:**
```bash
# Find process using port 8080
lsof -i :8080  # On Linux/Mac
netstat -ano | findstr :8080  # On Windows

# Use different port
docker run -p 9090:80 evplug-magazine:latest
```

## 🚢 Registry & Distribution

### Push to Docker Registry

#### Docker Hub:
```bash
# Tag image
docker tag evplug-magazine:latest yourusername/evplug-magazine:latest

# Login
docker login

# Push
docker push yourusername/evplug-magazine:latest
```

#### Private Registry:
```bash
# Tag for private registry
docker tag evplug-magazine:latest registry.yourdomain.com/evplug-magazine:latest

# Push to private registry
docker push registry.yourdomain.com/evplug-magazine:latest
```

### Pull and Run from Registry
```bash
# Pull from registry
docker pull yourusername/evplug-magazine:latest

# Run
docker run -d -p 8080:80 --env-file .env yourusername/evplug-magazine:latest
```

## 📝 Best Practices

1. **Use specific tags** instead of `latest` in production
2. **Set resource limits** for containers:
   ```bash
   docker run -d \
     --memory="512m" \
     --cpus="1.0" \
     -p 8080:80 \
     evplug-magazine:latest
   ```
3. **Use secrets** for sensitive data in production
4. **Enable logging driver** for centralized logging
5. **Regular backups** of configuration and images
6. **Monitor** container health and resource usage
7. **Update base images** regularly for security patches

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Strapi Documentation](https://docs.strapi.io/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
