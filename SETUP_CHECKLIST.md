# Strapi Integration Setup Checklist

Use this checklist to ensure your Strapi CMS integration is properly configured.

## ☑️ Pre-Integration Checklist

### Strapi Backend Setup

- [ ] **Strapi installed and running**
  - Accessible at: `http://localhost:1337/admin`
  - Version: Strapi v4.x or higher

- [ ] **Admin account created**
  - Username: _______________
  - Access to admin panel confirmed

- [ ] **Content types created**
  - [ ] Article (import from `strapi-article-schema.json`)
  - [ ] Category (name, slug, description, articles relation)
  - [ ] Tag (name, slug, articles relation)

- [ ] **Test content added**
  - [ ] At least 5-10 sample articles
  - [ ] Articles marked as "Published"
  - [ ] Featured images uploaded
  - [ ] Categories assigned
  - [ ] Tags assigned
  - [ ] At least 2 articles marked as "Featured"
  - [ ] At least 1 article marked as "Breaking News"

### Permissions Configuration

- [ ] **Public role permissions enabled**
  - Navigate to: Settings → Users & Permissions Plugin → Roles → Public
  - [ ] Article: `find` ✓
  - [ ] Article: `findOne` ✓
  - [ ] Category: `find` ✓
  - [ ] Category: `findOne` ✓
  - [ ] Tag: `find` ✓
  - [ ] Tag: `findOne` ✓
  - [ ] User: `find` ✓ (for author info)
  - [ ] User: `findOne` ✓ (for author info)

### API Token Generation

- [ ] **API token created**
  - Navigate to: Settings → API Tokens → Create new API Token
  - Name: `Magazine Frontend`
  - Token type: `Read-only` ✓
  - Duration: `Unlimited` or set expiration
  - Token copied and saved securely: _______________________

### CORS Configuration

- [ ] **CORS configured in Strapi**
  - File: `config/middlewares.js` in Strapi project
  - Origins added:
    - [ ] `http://localhost:8080`
    - [ ] Your production domain (if applicable)
  - Credentials enabled: `true`

Example configuration:
```javascript
{
  name: 'strapi::cors',
  config: {
    origin: ['http://localhost:8080', 'https://yourdomain.com'],
    credentials: true,
  },
}
```

## ☑️ Frontend Setup Checklist

### File Configuration

- [ ] **Configuration file updated**
  - File: `Magz-master/js/strapi-config.js`
  - [ ] `API_URL` set to: _______________
  - [ ] `API_TOKEN` updated with generated token
  - [ ] Default language set: `fr` / `ar` / `en`

- [ ] **Environment file created** (optional)
  - [ ] Copy `.env.example` to `.env`
  - [ ] Update values in `.env`

### Script Files Present

- [ ] `js/strapi-config.js` exists
- [ ] `js/strapi-api.js` exists
- [ ] `js/strapi-content.js` exists
- [ ] `strapi-demo.html` exists

### Dependencies Installed

```bash
npm install
```

- [ ] Node.js installed (v14+)
- [ ] npm packages installed
- [ ] `http-server` available

## ☑️ Testing Checklist

### Connection Test

- [ ] **Start development server**
  ```bash
  npm start
  ```

- [ ] **Open demo page**
  - URL: `http://localhost:8080/strapi-demo.html`
  - Page loads without errors

- [ ] **Test connection**
  - [ ] Click "Test Connection" button
  - [ ] Connection successful message appears
  - [ ] No CORS errors in console

### Feature Tests

- [ ] **Load articles test**
  - [ ] Click "Load Articles" - articles appear
  - [ ] Images load correctly
  - [ ] Article titles visible
  - [ ] Links work

- [ ] **Load featured articles**
  - [ ] Click "Load Featured" - featured articles appear
  - [ ] Only articles marked as featured show

- [ ] **Load breaking news**
  - [ ] Click "Load Breaking News"
  - [ ] Breaking news articles appear

- [ ] **Load categories**
  - [ ] Click "Load Categories"
  - [ ] All categories listed
  - [ ] Article counts shown

- [ ] **Search functionality**
  - [ ] Enter search term
  - [ ] Click "Search Articles"
  - [ ] Relevant results appear

### Browser Console Check

- [ ] **No errors in console**
  - Open Developer Tools (F12)
  - Check Console tab
  - [ ] No red errors
  - [ ] No CORS errors
  - [ ] No 404 errors
  - [ ] No authentication errors

### Data Verification

- [ ] **Article data complete**
  - [ ] Title displays
  - [ ] Excerpt/content visible
  - [ ] Published date formatted correctly
  - [ ] Author name shows
  - [ ] Category displayed
  - [ ] Tags appear (if any)
  - [ ] Like/view counts visible

- [ ] **Images working**
  - [ ] Featured images load
  - [ ] Image URLs correct
  - [ ] No broken image placeholders
  - [ ] Image formats appropriate

## ☑️ Integration Checklist

### Homepage Integration

- [ ] **Update index.html**
  - [ ] Scripts added before `</body>`
  - [ ] Article container has ID
  - [ ] Loading script added
  - [ ] Featured articles load
  - [ ] Recent articles in sidebar load

### Single Article Page

- [ ] **Update single.html**
  - [ ] Scripts added
  - [ ] URL parameter handling
  - [ ] Article content renders
  - [ ] Meta tags update
  - [ ] Related articles load
  - [ ] Share buttons work

### Category Page

- [ ] **Update category.html**
  - [ ] Scripts added
  - [ ] Category articles load
  - [ ] Pagination works
  - [ ] Category title displays

### Search Page

- [ ] **Update search.html**
  - [ ] Scripts added
  - [ ] Search form functional
  - [ ] Results display
  - [ ] Tag filtering works

## ☑️ Production Checklist

### Configuration

- [ ] **Production settings updated**
  - [ ] `API_URL` changed to production URL
  - [ ] HTTPS enabled
  - [ ] API token for production created
  - [ ] Environment variables used (not hardcoded)

### Performance

- [ ] **Optimization done**
  - [ ] Images optimized
  - [ ] Caching configured
  - [ ] CDN setup (if applicable)
  - [ ] Compression enabled

### Security

- [ ] **Security measures**
  - [ ] API token secured
  - [ ] HTTPS enforced
  - [ ] CORS restricted to actual domains
  - [ ] Rate limiting configured in Strapi

### Deployment

- [ ] **Frontend deployed**
  - [ ] Files uploaded to hosting
  - [ ] Domain configured
  - [ ] SSL certificate installed

- [ ] **Backend deployed**
  - [ ] Strapi deployed
  - [ ] Database configured
  - [ ] Media storage configured
  - [ ] Environment variables set

### Final Tests

- [ ] **Production testing**
  - [ ] All pages load
  - [ ] Articles fetch correctly
  - [ ] Search works
  - [ ] Categories work
  - [ ] Images display
  - [ ] No console errors
  - [ ] Performance acceptable
  - [ ] Mobile responsive

## 📝 Notes

**Strapi URL**: _______________________________________________

**API Token**: _______________________________________________

**Admin Email**: _______________________________________________

**Deployment Date**: __________________________________________

**Issues/Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Configure CORS in Strapi middlewares.js |
| 401 Unauthorized | Check API token and permissions |
| No articles returned | Verify articles are published |
| Images not loading | Check Strapi media library and URL |
| 404 on API calls | Verify Strapi is running and URL is correct |

## ✅ Ready to Launch!

Once all items are checked, your Strapi integration is complete and ready for use!

**Last Updated**: _________________________
**Verified By**: __________________________
