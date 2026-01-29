#!/bin/bash
# Docker Build and Deploy Script for Magazine Frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 EVPLUG Magazine - Docker Build Script${NC}"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f "Magz-master/.env.example" ]; then
        cp Magz-master/.env.example .env
        echo -e "${GREEN}✅ Created .env file. Please update it with your credentials.${NC}"
        echo ""
        echo "Required variables:"
        echo "  - STRAPI_API_URL"
        echo "  - STRAPI_API_TOKEN"
        echo ""
        read -p "Press enter to continue after updating .env, or Ctrl+C to exit..."
    else
        echo -e "${RED}❌ .env.example not found!${NC}"
        exit 1
    fi
fi

# Load environment variables
source .env

# Validate required variables
if [ -z "$STRAPI_API_URL" ] || [ -z "$STRAPI_API_TOKEN" ]; then
    echo -e "${RED}❌ Error: STRAPI_API_URL and STRAPI_API_TOKEN must be set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration loaded${NC}"
echo "   API URL: $STRAPI_API_URL"
echo "   Token: ${STRAPI_API_TOKEN:0:20}..."
echo ""

# Build options
echo "Select build option:"
echo "  1) Build only"
echo "  2) Build and run"
echo "  3) Build and run with docker-compose"
echo "  4) Build, tag, and push to registry"
read -p "Enter option (1-4): " option

IMAGE_NAME="evplug-magazine"
IMAGE_TAG="latest"

case $option in
    1)
        echo -e "${YELLOW}🔨 Building Docker image...${NC}"
        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
        echo -e "${GREEN}✅ Build complete!${NC}"
        echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
        ;;
    
    2)
        echo -e "${YELLOW}🔨 Building Docker image...${NC}"
        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
        
        echo -e "${YELLOW}🚀 Starting container...${NC}"
        
        # Stop and remove existing container if it exists
        docker stop ${IMAGE_NAME} 2>/dev/null || true
        docker rm ${IMAGE_NAME} 2>/dev/null || true
        
        # Run new container
        docker run -d \
            --name ${IMAGE_NAME} \
            -p 8080:80 \
            --restart unless-stopped \
            --env-file .env \
            ${IMAGE_NAME}:${IMAGE_TAG}
        
        echo -e "${GREEN}✅ Container started!${NC}"
        echo "Access your magazine at: http://localhost:8080"
        echo ""
        echo "View logs with: docker logs -f ${IMAGE_NAME}"
        ;;
    
    3)
        echo -e "${YELLOW}🔨 Building with docker-compose...${NC}"
        docker-compose up -d --build
        
        echo -e "${GREEN}✅ Services started!${NC}"
        echo "Access your magazine at: http://localhost:8080"
        echo ""
        echo "View logs with: docker-compose logs -f magazine-frontend"
        ;;
    
    4)
        read -p "Enter registry URL (e.g., docker.io/username or registry.company.com): " registry
        read -p "Enter version tag (default: latest): " version
        version=${version:-latest}
        
        FULL_IMAGE="${registry}/${IMAGE_NAME}:${version}"
        
        echo -e "${YELLOW}🔨 Building Docker image...${NC}"
        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
        
        echo -e "${YELLOW}🏷️  Tagging image...${NC}"
        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${FULL_IMAGE}
        
        echo -e "${YELLOW}📤 Pushing to registry...${NC}"
        docker push ${FULL_IMAGE}
        
        echo -e "${GREEN}✅ Image pushed to registry!${NC}"
        echo "Image: ${FULL_IMAGE}"
        echo ""
        echo "Pull and run with:"
        echo "  docker pull ${FULL_IMAGE}"
        echo "  docker run -d -p 8080:80 --env-file .env ${FULL_IMAGE}"
        ;;
    
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
