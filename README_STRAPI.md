# Magz Magazine - Strapi CMS Integration

This project integrates the Magz magazine template with Strapi CMS for dynamic content management.

## 🚀 Quick Start

### 1. Configure Strapi Connection

Edit [js/strapi-config.js](Magz-master/js/strapi-config.js):

```javascript
const STRAPI_CONFIG = {
    API_URL: 'http://localhost:1337',  // Your Strapi instance URL
    API_TOKEN: 'your-api-token-here',  // Generate from Strapi admin
    // ... rest remains the same
};
```

### 2. Generate API Token

1. Open Strapi Admin Panel
2. Go to **Settings → API Tokens**
3. Click **Create new API Token**
4. Set permissions to **Read-only**
5. Copy the token to your config

### 3. Test Integration

Open `strapi-demo.html` in your browser to test the connection:

```bash
npm start
```

Then navigate to: `http://localhost:8080/strapi-demo.html`

## 📁 Integration Files

| File | Purpose |
|------|---------|
| `js/strapi-config.js` | Configuration (API URL, token, endpoints) |
| `js/strapi-api.js` | API client for fetching data |
| `js/strapi-content.js` | HTML rendering functions |
| `strapi-demo.html` | Test page to verify integration |
| `.env.example` | Environment variables template |
| `STRAPI_INTEGRATION.md` | Detailed integration guide |

## 🔌 API Endpoints Used

- `/api/articles` - All articles
- `/api/categories` - Categories
- `/api/tags` - Tags
- `/api/users` - Authors

## 📊 Strapi Schema

The article schema is defined in `strapi-article-schema.json` with these key fields:

- **Content**: title, slug, excerpt, content, featuredImage
- **Meta**: publishedDate, author, category, tags
- **Engagement**: likes, views, shares
- **Features**: isFeatured, isBreakingNews
- **SEO**: metaTitle, metaDescription, ogImage
- **Settings**: language (fr/ar/en), status, readTime

## 🎯 Features

✅ Dynamic article loading  
✅ Featured articles section  
✅ Breaking news ticker  
✅ Category filtering  
✅ Tag-based filtering  
✅ Full-text search  
✅ Related articles  
✅ Multi-language support (FR/AR/EN)  
✅ SEO meta tags  
✅ Social sharing  
✅ View/Like/Share tracking  

## 🛠️ Integration Example

### Homepage Integration

```html
<!-- Include Strapi scripts -->
<script src="js/strapi-config.js"></script>
<script src="js/strapi-api.js"></script>
<script src="js/strapi-content.js"></script>

<script>
$(document).ready(async function() {
    // Load featured articles
    const data = await strapiAPI.getFeaturedArticles(6);
    
    if (data.data) {
        const container = $('#articles');
        data.data.forEach(article => {
            container.append(strapiRenderer.renderArticleCard(article));
        });
    }
});
</script>
```

### Single Article Page

```html
<script>
$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    const articleData = await strapiAPI.getArticle(slug, true);
    
    if (articleData.data) {
        $('#article-content').html(
            strapiRenderer.renderFullArticle(articleData.data)
        );
    }
});
</script>
```

## 🔒 Strapi Configuration

### Required Content Types

1. **Article** (use provided schema)
2. **Category** (name, slug, description)
3. **Tag** (name, slug)

### Permissions Setup

Enable these permissions for **Public** role:

- ✅ Article: find, findOne
- ✅ Category: find, findOne
- ✅ Tag: find, findOne
- ✅ User: find, findOne (for authors)

### CORS Configuration

Edit `config/middlewares.js` in Strapi:

```javascript
{
  name: 'strapi::cors',
  config: {
    origin: ['http://localhost:8080', 'your-domain.com'],
    credentials: true,
  },
}
```

## 🌐 Environment Variables

Create `.env` file (copy from `.env.example`):

```env
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here
DEFAULT_LANGUAGE=fr
ARTICLES_PER_PAGE=10
```

## 📖 API Usage Examples

```javascript
// Get featured articles
const featured = await strapiAPI.getFeaturedArticles(6);

// Search articles
const results = await strapiAPI.searchArticles('electric vehicles');

// Get articles by category
const categoryArticles = await strapiAPI.getArticlesByCategory('technology');

// Get single article by slug
const article = await strapiAPI.getArticle('my-article-slug', true);

// Get popular articles
const popular = await strapiAPI.getPopularArticles(5);
```

## 🎨 Customization

### Change Default Language

In `strapi-config.js`:

```javascript
FILTERS: {
    LANGUAGE_FR: 'filters[language][$eq]=fr',  // Change to 'ar' or 'en'
}
```

### Adjust Pagination

```javascript
PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,      // Articles per page
    HOMEPAGE_FEATURED: 6,        // Featured on homepage
    SIDEBAR_RECENT: 5,           // Recent in sidebar
}
```

## 🐛 Troubleshooting

### Connection Errors

1. ✅ Verify Strapi is running (`http://localhost:1337/admin`)
2. ✅ Check API token is valid
3. ✅ Confirm CORS is configured
4. ✅ Ensure public permissions are enabled

### Images Not Loading

1. ✅ Check media uploads in Strapi
2. ✅ Verify `API_URL` includes protocol (http://)
3. ✅ Confirm image formats are generated

### No Data Returned

1. ✅ Add some articles in Strapi admin
2. ✅ Set articles to "Published" status
3. ✅ Check language filter matches article language

## 📚 Documentation

- [Full Integration Guide](STRAPI_INTEGRATION.md)
- [Strapi Documentation](https://docs.strapi.io)
- [Article Schema](strapi-article-schema.json)

## 🚀 Production Deployment

1. Update `API_URL` to production Strapi URL
2. Use environment variables for sensitive data
3. Enable HTTPS for both frontend and backend
4. Configure CDN for media files
5. Implement caching strategy

## 📝 License

Same as the original Magz template.

## 🤝 Support

For issues:
- Check [STRAPI_INTEGRATION.md](STRAPI_INTEGRATION.md)
- Review browser console errors
- Verify Strapi configuration
- Test with `strapi-demo.html`

---

**Ready to use!** Configure your Strapi connection and test with the demo page. 🎉
