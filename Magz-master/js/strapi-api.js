/**
 * Strapi API Client
 * Handles all API calls to Strapi CMS
 */

class StrapiAPI {
    constructor(config) {
        this.config = config || STRAPI_CONFIG;
        this.baseURL = this.config.API_URL;
        this.token = this.config.API_TOKEN;
    }

    /**
     * Make a GET request to Strapi API
     */
    async get(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseURL}${endpoint}${queryString ? '?' + queryString : ''}`;
            
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Add authorization header if token is provided
            if (this.token && this.token !== 'YOUR_STRAPI_API_TOKEN_HERE') {
                headers['Authorization'] = `Bearer ${this.token}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Strapi API Error:', error);
            throw error;
        }
    }

    /**
     * Get all articles with optional filters
     */
    async getArticles(options = {}) {
        const {
            page = 1,
            pageSize = this.config.PAGINATION.DEFAULT_PAGE_SIZE,
            populate = this.config.POPULATE.ARTICLE_LIST,
            sort = this.config.SORT.NEWEST,
            filters = {},
            language = 'fr'
        } = options;

        const params = {
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            ...this.parseQueryString(populate),
            ...this.parseQueryString(sort),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`)
        };

        // Add custom filters
        Object.keys(filters).forEach(key => {
            params[key] = filters[key];
        });

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get featured articles
     */
    async getFeaturedArticles(limit = 6, language = 'fr') {
        const params = {
            'pagination[pageSize]': limit,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.NEWEST),
            ...this.parseQueryString(this.config.FILTERS.FEATURED),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`)
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get breaking news articles
     */
    async getBreakingNews(language = 'fr') {
        const params = {
            'pagination[pageSize]': 5,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.NEWEST),
            ...this.parseQueryString(this.config.FILTERS.BREAKING_NEWS),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`)
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get single article by slug or ID
     */
    async getArticle(identifier, bySlug = true) {
        const params = {
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_FULL)
        };

        if (bySlug) {
            params['filters[slug][$eq]'] = identifier;
        }

        const response = await this.get(this.config.ENDPOINTS.ARTICLES, params);
        
        if (bySlug && response.data && response.data.length > 0) {
            return { data: response.data[0], meta: response.meta };
        }
        
        return response;
    }

    /**
     * Get article by ID
     */
    async getArticleById(id) {
        const params = {
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_FULL)
        };

        return await this.get(`${this.config.ENDPOINTS.ARTICLES}/${id}`, params);
    }

    /**
     * Get articles by category
     */
    async getArticlesByCategory(categorySlug, options = {}) {
        const {
            page = 1,
            pageSize = this.config.PAGINATION.DEFAULT_PAGE_SIZE,
            language = 'fr'
        } = options;

        const params = {
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.NEWEST),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`),
            'filters[category][slug][$eq]': categorySlug
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get articles by tag
     */
    async getArticlesByTag(tagSlug, options = {}) {
        const {
            page = 1,
            pageSize = this.config.PAGINATION.DEFAULT_PAGE_SIZE,
            language = 'fr'
        } = options;

        const params = {
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.NEWEST),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`),
            'filters[tags][slug][$eq]': tagSlug
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Search articles
     */
    async searchArticles(query, options = {}) {
        const {
            page = 1,
            pageSize = this.config.PAGINATION.DEFAULT_PAGE_SIZE,
            language = 'fr'
        } = options;

        const params = {
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.NEWEST),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`),
            'filters[$or][0][title][$containsi]': query,
            'filters[$or][1][excerpt][$containsi]': query,
            'filters[$or][2][content][$containsi]': query
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get recent articles
     */
    async getRecentArticles(limit = 5, language = 'fr') {
        const params = {
            'pagination[pageSize]': limit,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.NEWEST),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`)
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get popular articles (most viewed)
     */
    async getPopularArticles(limit = 5, language = 'fr') {
        const params = {
            'pagination[pageSize]': limit,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.MOST_VIEWED),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`)
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get related articles
     */
    async getRelatedArticles(categoryId, currentArticleId, limit = 4, language = 'fr') {
        const params = {
            'pagination[pageSize]': limit,
            ...this.parseQueryString(this.config.POPULATE.ARTICLE_LIST),
            ...this.parseQueryString(this.config.SORT.NEWEST),
            ...this.parseQueryString(this.config.FILTERS.PUBLISHED),
            ...this.parseQueryString(`filters[language][$eq]=${language}`),
            'filters[category][id][$eq]': categoryId,
            'filters[id][$ne]': currentArticleId
        };

        return await this.get(this.config.ENDPOINTS.ARTICLES, params);
    }

    /**
     * Get all categories
     */
    async getCategories() {
        const params = {
            ...this.parseQueryString(this.config.POPULATE.CATEGORY),
            'pagination[pageSize]': 100
        };

        return await this.get(this.config.ENDPOINTS.CATEGORIES, params);
    }

    /**
     * Get all tags
     */
    async getTags() {
        const params = {
            'pagination[pageSize]': 100
        };

        return await this.get(this.config.ENDPOINTS.TAGS, params);
    }

    /**
     * Increment article views
     */
    async incrementViews(articleId, currentViews) {
        // This would typically be a PUT/PATCH request
        // For now, we'll log it - you'll need to implement the backend endpoint
        console.log(`Incrementing views for article ${articleId}`);
        // TODO: Implement PUT request to update views
    }

    /**
     * Increment article likes
     */
    async incrementLikes(articleId, currentLikes) {
        // This would typically be a PUT/PATCH request
        console.log(`Incrementing likes for article ${articleId}`);
        // TODO: Implement PUT request to update likes
    }

    /**
     * Increment article shares
     */
    async incrementShares(articleId, currentShares) {
        // This would typically be a PUT/PATCH request
        console.log(`Incrementing shares for article ${articleId}`);
        // TODO: Implement PUT request to update shares
    }

    /**
     * Get image URL from Strapi media object
     */
    getImageURL(mediaObject, format = 'medium') {
        if (!mediaObject || !mediaObject.data) {
            return '/images/placeholder.jpg';
        }

        const imageData = mediaObject.data.attributes;
        
        // Return formatted image if available
        if (imageData.formats && imageData.formats[format]) {
            return `${this.baseURL}${imageData.formats[format].url}`;
        }
        
        // Fallback to original image
        return `${this.baseURL}${imageData.url}`;
    }

    /**
     * Format date to readable format
     */
    formatDate(dateString, locale = 'fr-FR') {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Helper to parse query strings
     */
    parseQueryString(queryString) {
        if (!queryString) return {};
        
        const params = {};
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = value;
            }
        });
        
        return params;
    }

    /**
     * Extract plain text from rich text content
     */
    extractPlainText(richText, maxLength = 200) {
        if (!richText) return '';
        
        // Remove markdown/HTML tags
        const text = richText.replace(/<[^>]*>/g, '').replace(/[#*_~`]/g, '');
        
        if (text.length <= maxLength) return text;
        
        return text.substring(0, maxLength) + '...';
    }
}

// Initialize the API client
const strapiAPI = new StrapiAPI(STRAPI_CONFIG);
