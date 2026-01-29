# Strapi CMS Integration for Magz Magazine Template

This document explains how to integrate the Magz magazine template with Strapi CMS.

## Prerequisites

1. **Strapi Backend** - You need a running Strapi instance with the article schema
2. **Node.js** - For running the development server
3. **API Token** - Generate from Strapi Admin Panel

## Setup Instructions

### 1. Configure Strapi Backend

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Strapi details:
   ```
   STRAPI_API_URL=http://localhost:1337
   STRAPI_API_TOKEN=your_actual_token_here
   DEFAULT_LANGUAGE=fr
   ```

3. Alternatively, edit `js/strapi-config.js` directly:
   ```javascript
   const STRAPI_CONFIG = {
       API_URL: 'http://localhost:1337',  // Your Strapi URL
       API_TOKEN: 'your_token_here',      // Your API token
       // ... rest of config
   };
   ```

### 2. Generate Strapi API Token

1. Log in to your Strapi Admin Panel
2. Go to **Settings** > **API Tokens**
3. Click **Create new API Token**
4. Configure:
   - **Name**: Magazine Frontend
   - **Token type**: Read-only (for frontend)
   - **Token duration**: Unlimited or set expiration
5. Copy the generated token and add it to your configuration

### 3. Strapi Content Type Setup

Import the article schema from `strapi-article-schema.json`:

1. In Strapi Admin, go to **Content-Type Builder**
2. Create a new Collection Type: **Article**
3. Import the schema or manually create fields as per the schema

**Required Content Types:**
- **Article** (main content type - schema provided)
- **Category** (for article categorization)
- **Tag** (for article tagging)

**Category Schema:**
```json
{
  "name": "string (required)",
  "slug": "uid (targetField: name)",
  "description": "text",
  "articles": "relation (oneToMany with Article)"
}
```

**Tag Schema:**
```json
{
  "name": "string (required)",
  "slug": "uid (targetField: name)",
  "articles": "relation (manyToMany with Article)"
}
```

### 4. Configure Permissions

1. In Strapi Admin, go to **Settings** > **Users & Permissions Plugin** > **Roles**
2. Select **Public** role
3. Enable the following permissions:
   - **Article**: `find`, `findOne`
   - **Category**: `find`, `findOne`
   - **Tag**: `find`, `findOne`
   - **User**: `find`, `findOne` (for author information)

### 5. Include Scripts in HTML

Add these script tags to your HTML pages **before** the closing `</body>` tag:

```html
<!-- Strapi Integration Scripts -->
<script src="js/strapi-config.js"></script>
<script src="js/strapi-api.js"></script>
<script src="js/strapi-content.js"></script>
```

**Order is important!** Load them in this sequence.

### 6. Update HTML Pages

#### Homepage (index.html)

Add this script at the bottom of the page:

```html
<script>
// Load featured articles on homepage
$(document).ready(async function() {
    try {
        // Get featured articles
        const featuredData = await strapiAPI.getFeaturedArticles(6);
        const articlesContainer = $('#featured-articles');
        
        if (featuredData.data && featuredData.data.length > 0) {
            articlesContainer.empty();
            featuredData.data.forEach(article => {
                articlesContainer.append(strapiRenderer.renderArticleCard(article));
            });
        }
        
        // Get recent articles for sidebar
        const recentData = await strapiAPI.getRecentArticles(5);
        const recentContainer = $('#recent-articles');
        
        if (recentData.data && recentData.data.length > 0) {
            recentContainer.empty();
            recentData.data.forEach(article => {
                recentContainer.append(strapiRenderer.renderCompactArticle(article));
            });
        }
        
        // Load breaking news
        const breakingData = await strapiAPI.getBreakingNews();
        if (breakingData.data && breakingData.data.length > 0) {
            const breakingNews = strapiRenderer.renderBreakingNews(breakingData.data);
            $('header.primary').after(breakingNews);
        }
        
    } catch (error) {
        console.error('Error loading articles:', error);
        // Show fallback content or error message
    }
});
</script>
```

#### Single Article Page (single.html)

```html
<script>
$(document).ready(async function() {
    // Get article slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const articleData = await strapiAPI.getArticle(slug, true);
        
        if (articleData.data) {
            const article = articleData.data;
            
            // Render article
            $('#article-content').html(strapiRenderer.renderFullArticle(article));
            
            // Update page title and meta tags
            document.title = article.attributes.metaTitle || article.attributes.title;
            
            // Update meta tags
            $('meta[name="description"]').attr('content', article.attributes.metaDescription || '');
            $('meta[property="og:title"]').attr('content', article.attributes.metaTitle || article.attributes.title);
            $('meta[property="og:description"]').attr('content', article.attributes.metaDescription || '');
            
            // Increment views
            await strapiAPI.incrementViews(article.id, article.attributes.views);
            
            // Load related articles
            if (article.attributes.category?.data?.id) {
                const relatedData = await strapiAPI.getRelatedArticles(
                    article.attributes.category.data.id,
                    article.id,
                    4
                );
                
                if (relatedData.data && relatedData.data.length > 0) {
                    const relatedContainer = $('#related-articles');
                    relatedContainer.empty();
                    relatedData.data.forEach(relatedArticle => {
                        relatedContainer.append(strapiRenderer.renderArticleCard(relatedArticle));
                    });
                }
            }
        } else {
            window.location.href = '404.html';
        }
    } catch (error) {
        console.error('Error loading article:', error);
        window.location.href = '404.html';
    }
});

// Share functionality
function shareArticle(platform) {
    const url = window.location.href;
    const title = document.title;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        // Increment shares
        // strapiAPI.incrementShares(articleId, currentShares);
    }
}
</script>
```

#### Category Page (category.html)

```html
<script>
$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categorySlug = urlParams.get('slug');
    let currentPage = parseInt(urlParams.get('page')) || 1;
    
    if (!categorySlug) {
        window.location.href = 'index.html';
        return;
    }
    
    async function loadArticles(page) {
        try {
            const articlesData = await strapiAPI.getArticlesByCategory(categorySlug, {
                page: page,
                pageSize: 10
            });
            
            if (articlesData.data && articlesData.data.length > 0) {
                const container = $('#category-articles');
                container.empty();
                
                articlesData.data.forEach(article => {
                    container.append(strapiRenderer.renderArticleCard(article));
                });
                
                // Render pagination
                $('#pagination').html(strapiRenderer.renderPagination(articlesData.meta));
                
                // Update category title
                const categoryName = articlesData.data[0].attributes.category?.data?.attributes?.name || 'Category';
                $('#category-title').text(categoryName);
                
            } else {
                $('#category-articles').html('<p>No articles found in this category.</p>');
            }
        } catch (error) {
            console.error('Error loading category articles:', error);
        }
    }
    
    // Initial load
    loadArticles(currentPage);
    
    // Pagination click handler
    $(document).on('click', '.pagination a[data-page]', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        loadArticles(page);
        window.scrollTo(0, 0);
    });
});
</script>
```

#### Search Page (search.html)

```html
<script>
$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const tagSlug = urlParams.get('tag');
    let currentPage = parseInt(urlParams.get('page')) || 1;
    
    async function performSearch(page) {
        try {
            let resultsData;
            
            if (tagSlug) {
                resultsData = await strapiAPI.getArticlesByTag(tagSlug, { page: page });
            } else if (query) {
                resultsData = await strapiAPI.searchArticles(query, { page: page });
            } else {
                resultsData = await strapiAPI.getArticles({ page: page });
            }
            
            const container = $('#search-results');
            container.empty();
            
            if (resultsData.data && resultsData.data.length > 0) {
                resultsData.data.forEach(article => {
                    container.append(strapiRenderer.renderArticleCard(article));
                });
                
                $('#pagination').html(strapiRenderer.renderPagination(resultsData.meta));
                $('#result-count').text(`${resultsData.meta.pagination.total} résultats trouvés`);
            } else {
                container.html('<p>Aucun résultat trouvé.</p>');
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
    }
    
    performSearch(currentPage);
});
</script>
```

## File Structure

```
Magz-master/
├── js/
│   ├── strapi-config.js      # Strapi configuration
│   ├── strapi-api.js          # API client
│   ├── strapi-content.js      # Content renderer
│   └── e-magz.js              # Original theme JS
├── .env.example               # Environment variables template
└── STRAPI_INTEGRATION.md      # This file
```

## API Endpoints

The integration uses the following Strapi API endpoints:

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags
- `GET /api/users` - Get authors

## Features Supported

✅ Dynamic article loading from Strapi
✅ Featured articles
✅ Breaking news ticker
✅ Category filtering
✅ Tag filtering
✅ Search functionality
✅ Related articles
✅ Popular/Recent articles
✅ Multi-language support (fr, ar, en)
✅ SEO meta tags
✅ Image gallery support
✅ Social sharing
✅ View/Like/Share tracking

## Troubleshooting

### CORS Issues

If you encounter CORS errors, update Strapi's CORS configuration:

1. Edit `config/middlewares.js` in your Strapi project:

```javascript
module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:8080', 'your-frontend-domain.com'],
      credentials: true,
    },
  },
  // ...
];
```

### API Token Not Working

1. Make sure the token is valid and not expired
2. Check that you've enabled the correct permissions for Public role
3. Verify the token is correctly set in `strapi-config.js`

### Images Not Loading

1. Check that Strapi's media library is properly configured
2. Verify the `API_URL` in your config includes the protocol (http:// or https://)
3. Ensure image uploads are successful in Strapi

## Production Deployment

1. Update `STRAPI_API_URL` to your production Strapi URL
2. Use environment variables instead of hardcoded values
3. Enable HTTPS for both frontend and Strapi backend
4. Consider using a CDN for images
5. Implement caching strategies for better performance

## Support

For issues specific to:
- **Strapi**: Visit [Strapi Documentation](https://docs.strapi.io)
- **Template**: Check the Magz template documentation
- **Integration**: Review this guide or check browser console for errors
