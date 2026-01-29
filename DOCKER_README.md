# Magazine Frontend - Docker Deployment

## 🚀 Quick Deploy

### Windows
```cmd
build.bat
```

### Linux/Mac
```bash
chmod +x build.sh
./build.sh
```

## 📦 What's Included

- **Dockerfile** - Multi-stage build with Nginx
- **docker-compose.yml** - Full stack deployment
- **nginx.conf** - Optimized Nginx configuration
- **docker-entrypoint.sh** - Dynamic configuration
- **.dockerignore** - Optimized build context
- **build scripts** - Easy deployment (Windows & Linux)

## ⚡ Quick Start

1. **Configure environment**:
   ```bash
   cp Magz-master/.env.example .env
   # Edit .env with your Strapi credentials
   ```

2. **Build and run**:
   ```bash
   docker-compose up -d
   ```

3. **Access**:
   ```
   http://localhost:8080
   ```

## 🛠️ Manual Commands

### Build
```bash
docker build -t evplug-magazine:latest .
```

### Run
```bash
docker run -d \
  --name evplug-magazine \
  -p 8080:80 \
  --env-file .env \
  evplug-magazine:latest
```

### View logs
```bash
docker logs -f evplug-magazine
```

### Stop
```bash
docker stop evplug-magazine
docker rm evplug-magazine
```

## 📋 Environment Variables

Required in `.env`:
- `STRAPI_API_URL` - Your Strapi backend URL
- `STRAPI_API_TOKEN` - Your Strapi API token

Optional:
- `DEFAULT_LANGUAGE` - Default language (fr/ar/en)
- `ARTICLES_PER_PAGE` - Articles per page
- `HOMEPAGE_FEATURED` - Featured articles count

## 📚 Full Documentation

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for complete deployment guide.

## 🐳 Image Details

- **Base**: Nginx Alpine (lightweight)
- **Size**: ~50MB
- **Port**: 80
- **Health check**: Included
- **Auto-restart**: Configured

## 🔧 Features

✅ Multi-stage build (optimized size)  
✅ Nginx with compression  
✅ Environment variable substitution  
✅ Health checks  
✅ Security headers  
✅ Static asset caching  
✅ Auto-restart on failure  

---

**Your Strapi URL**: `https://management.evborne.ma`  
**Ready to deploy!** 🚀
