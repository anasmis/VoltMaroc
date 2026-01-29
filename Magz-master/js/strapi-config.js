/**
 * Strapi CMS Configuration
 * Configure your Strapi backend connection here
 */

const STRAPI_CONFIG = {
    // Strapi API Base URL (change this to your Strapi instance URL)
    API_URL: 'https://management.evborne.ma',
    
    // Strapi API Token (generate this from Strapi Admin Panel > Settings > API Tokens)
    // For production, use environment variables or a secure method
    API_TOKEN: '2faa650c59f73154d3dd27837812c2ee17408dda06f31c09f64e771acb749a1fb69a343de27b3309f177798bc3fb7772c476ad521a9b3cbdc881c9fd10aa1ad3958b43b02b001a5178cfe1c4d0258abfbdb9e6a3e1b1ee4c8d784ad49ce592b635d9e5388182db670a2b455ace78aa4931c9e28d52014f4df1b31ee0d0e259bc',
    
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
        DEFAULT_PAGE_SIZE: 10,
        HOMEPAGE_FEATURED: 6,
        SIDEBAR_RECENT: 5,
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
        FEATURED: 'filters[isFeatured][$eq]=true',
        BREAKING_NEWS: 'filters[isBreakingNews][$eq]=true',
        PUBLISHED: 'filters[status][$eq]=published',
        LANGUAGE_FR: 'filters[language][$eq]=fr',
        LANGUAGE_AR: 'filters[language][$eq]=ar',
        LANGUAGE_EN: 'filters[language][$eq]=en'
    },
    
    // Image settings
    IMAGE: {
        // Strapi image formats: thumbnail, small, medium, large
        DEFAULT_FORMAT: 'medium',
        THUMBNAIL_FORMAT: 'small',
        FULL_FORMAT: 'large'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STRAPI_CONFIG;
}
