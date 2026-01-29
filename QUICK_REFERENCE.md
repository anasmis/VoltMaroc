# Strapi Integration - Quick Reference Card

## 🔧 Setup (3 steps)

1. **Edit config**: `js/strapi-config.js`
   ```js
   API_URL: 'http://localhost:1337',
   API_TOKEN: 'your-token-here'
   ```

2. **Generate token**: Strapi Admin → Settings → API Tokens → Create

3. **Enable permissions**: Settings → Roles → Public → Enable find/findOne for:
   - Article, Category, Tag, User

## 📦 Include Scripts (in order)

```html
<script src="js/strapi-config.js"></script>
<script src="js/strapi-api.js"></script>
<script src="js/strapi-content.js"></script>
```

## 🎯 Common API Calls

```javascript
// Featured articles
const featured = await strapiAPI.getFeaturedArticles(6);

// All articles with pagination
const articles = await strapiAPI.getArticles({ 
    page: 1, 
    pageSize: 10 
});

// Single article by slug
const article = await strapiAPI.getArticle('article-slug', true);

// By category
const catArticles = await strapiAPI.getArticlesByCategory('tech');

// Search
const results = await strapiAPI.searchArticles('query');

// Recent articles
const recent = await strapiAPI.getRecentArticles(5);

// Popular (most viewed)
const popular = await strapiAPI.getPopularArticles(5);

// Breaking news
const breaking = await strapiAPI.getBreakingNews();

// Categories
const categories = await strapiAPI.getCategories();

// Tags
const tags = await strapiAPI.getTags();
```

## 🎨 Rendering Components

```javascript
// Article card (for listings)
strapiRenderer.renderArticleCard(article)

// Compact article (for sidebars)
strapiRenderer.renderCompactArticle(article)

// Full article (for single page)
strapiRenderer.renderFullArticle(article)

// Pagination
strapiRenderer.renderPagination(meta)

// Breaking news ticker
strapiRenderer.renderBreakingNews(articles)
```

## 🖼️ Image Handling

```javascript
// Get image URL
const imageURL = strapiAPI.getImageURL(
    article.attributes.featuredImage, 
    'medium' // or 'small', 'large', 'thumbnail'
);
```

## 📅 Date Formatting

```javascript
const formatted = strapiAPI.formatDate(
    article.attributes.publishedDate,
    'fr-FR' // or 'ar-AR', 'en-US'
);
```

## 📄 Complete Page Example

```html
<!DOCTYPE html>
<html>
<head>
    <!-- CSS files -->
</head>
<body>
    <div id="articles-container"></div>

    <!-- jQuery -->
    <script src="js/jquery.js"></script>
    
    <!-- Strapi Scripts -->
    <script src="js/strapi-config.js"></script>
    <script src="js/strapi-api.js"></script>
    <script src="js/strapi-content.js"></script>

    <script>
    $(document).ready(async function() {
        try {
            const data = await strapiAPI.getFeaturedArticles(6);
            const container = $('#articles-container');
            
            if (data.data && data.data.length > 0) {
                data.data.forEach(article => {
                    container.append(
                        strapiRenderer.renderArticleCard(article)
                    );
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    </script>
</body>
</html>
```

## 🔍 URL Parameters

```javascript
// Get slug from URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');
const categorySlug = urlParams.get('category');
const page = parseInt(urlParams.get('page')) || 1;
```

## 🎯 Filter Options

```javascript
// Language filter
strapiAPI.getArticles({ language: 'fr' }) // or 'ar', 'en'

// With custom filters
strapiAPI.getArticles({
    page: 1,
    pageSize: 10,
    language: 'fr',
    filters: {
        'filters[isFeatured][$eq]': true
    }
});
```

## 📊 Response Structure

```javascript
{
    data: [
        {
            id: 1,
            attributes: {
                title: "Article Title",
                slug: "article-slug",
                excerpt: "Short description",
                content: "Full content",
                publishedDate: "2024-01-01",
                likes: 10,
                views: 100,
                featuredImage: { data: {...} },
                category: { data: {...} },
                author: { data: {...} },
                tags: { data: [...] }
            }
        }
    ],
    meta: {
        pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 5,
            total: 50
        }
    }
}
```

## ⚙️ Configuration Constants

```javascript
// Endpoints
STRAPI_CONFIG.ENDPOINTS.ARTICLES    // '/api/articles'
STRAPI_CONFIG.ENDPOINTS.CATEGORIES  // '/api/categories'
STRAPI_CONFIG.ENDPOINTS.TAGS        // '/api/tags'

// Pagination
STRAPI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE  // 10
STRAPI_CONFIG.PAGINATION.HOMEPAGE_FEATURED  // 6

// Sorting
STRAPI_CONFIG.SORT.NEWEST         // 'sort=publishedDate:desc'
STRAPI_CONFIG.SORT.MOST_VIEWED    // 'sort=views:desc'
STRAPI_CONFIG.SORT.MOST_LIKED     // 'sort=likes:desc'

// Filters
STRAPI_CONFIG.FILTERS.FEATURED         // Featured articles
STRAPI_CONFIG.FILTERS.BREAKING_NEWS    // Breaking news
STRAPI_CONFIG.FILTERS.PUBLISHED        // Published only
```

## 🐛 Debug Checklist

- [ ] Strapi running? (`http://localhost:1337/admin`)
- [ ] API token valid?
- [ ] CORS configured?
- [ ] Public permissions enabled?
- [ ] Articles published?
- [ ] Check browser console for errors
- [ ] Test with `strapi-demo.html`

## 🔗 Links

- Config: `js/strapi-config.js`
- Demo: `strapi-demo.html`
- Docs: `STRAPI_INTEGRATION.md`
- Schema: `strapi-article-schema.json`

---
**Test First**: Open `strapi-demo.html` → Test Connection → Load Articles
