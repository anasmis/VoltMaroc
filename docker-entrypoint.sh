#!/bin/sh
set -e

# Substitute environment variables in strapi-config.js
if [ -n "$STRAPI_API_URL" ] && [ -n "$STRAPI_API_TOKEN" ]; then
    echo "🔧 Configuring Strapi connection..."
    
    # Create temporary config file with environment variables
    cat > /usr/share/nginx/html/js/strapi-config.js << EOF
/**
 * Strapi CMS Configuration
 * Auto-generated from environment variables
 */

const STRAPI_CONFIG = {
    // Strapi API Base URL
    API_URL: '${STRAPI_API_URL}',
    
    // Strapi API Token
    API_TOKEN: '${STRAPI_API_TOKEN}',
    
    // API Endpoints
    ENDPOINTS: {
        ARTICLES: '/api/articles',
        CATEGORIES: '/api/categories',
        TAGS: '/api/tags',
        AUTHORS: '/api/users'
    },
    
    // Populate settings for relations
    POPULATE: {
        ARTICLE_FULL: 'populate[0]=featuredImage&populate[1]=gallery&populate[2]=ogImage&populate[3]=author&populate[4]=category&populate[5]=tags',
        ARTICLE_LIST: 'populate[0]=featuredImage&populate[1]=author&populate[2]=category&populate[3]=tags',
        CATEGORY: 'populate=*'
    },
    
    // Pagination settings
    PAGINATION: {
        DEFAULT_PAGE_SIZE: ${ARTICLES_PER_PAGE:-10},
        HOMEPAGE_FEATURED: ${HOMEPAGE_FEATURED:-6},
        SIDEBAR_RECENT: ${SIDEBAR_RECENT:-5},
        RELATED_ARTICLES: 4
    },
    
    // Sorting options
    SORT: {
        NEWEST: 'sort=publishedDate:desc',
        OLDEST: 'sort=publishedDate:asc',
        MOST_VIEWED: 'sort=views:desc',
        MOST_LIKED: 'sort=likes:desc'
    },
    
    // Filters
    FILTERS: {
        FEATURED: 'filters[isFeatured][\$eq]=true',
        BREAKING_NEWS: 'filters[isBreakingNews][\$eq]=true',
        PUBLISHED: 'filters[status][\$eq]=published',
        LANGUAGE_FR: 'filters[language][\$eq]=fr',
        LANGUAGE_AR: 'filters[language][\$eq]=ar',
        LANGUAGE_EN: 'filters[language][\$eq]=en'
    },
    
    // Image settings
    IMAGE: {
        DEFAULT_FORMAT: 'medium',
        THUMBNAIL_FORMAT: 'small',
        FULL_FORMAT: 'large'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STRAPI_CONFIG;
}
EOF

    echo "✅ Strapi configuration updated"
    echo "   API URL: ${STRAPI_API_URL}"
    echo "   Token: ${STRAPI_API_TOKEN:0:20}..."
else
    echo "⚠️  WARNING: STRAPI_API_URL or STRAPI_API_TOKEN not set!"
    echo "   Using default configuration from strapi-config.js"
fi

# Execute the main command
exec "$@"
