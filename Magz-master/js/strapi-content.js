/**
 * Strapi Content Renderer
 * Renders Strapi content into HTML templates
 */

class StrapiContentRenderer {
    constructor(api) {
        this.api = api;
    }

    /**
     * Render article card
     */
    renderArticleCard(article) {
        const attrs = article.attributes;
        const imageURL = this.api.getImageURL(attrs.featuredImage, 'medium');
        const categoryName = attrs.category?.data?.attributes?.name || 'Uncategorized';
        const categorySlug = attrs.category?.data?.attributes?.slug || '#';
        const authorName = attrs.author?.data?.attributes?.username || 'Anonymous';
        const formattedDate = this.api.formatDate(attrs.publishedDate);
        const excerpt = attrs.excerpt || this.api.extractPlainText(attrs.content, 150);
        
        return `
            <article class="article">
                <div class="inner">
                    <figure>
                        <a href="single.html?slug=${attrs.slug}">
                            <img src="${imageURL}" alt="${attrs.title}">
                        </a>
                    </figure>
                    <div class="padding">
                        <div class="detail">
                            <div class="time">${formattedDate}</div>
                            <div class="category"><a href="category.html?slug=${categorySlug}">${categoryName}</a></div>
                        </div>
                        <h2><a href="single.html?slug=${attrs.slug}">${attrs.title}</a></h2>
                        <p>${excerpt}</p>
                        <footer>
                            <a href="#" class="love"><i class="ion-android-favorite-outline"></i> <div>${attrs.likes || 0}</div></a>
                            <a class="btn btn-primary more" href="single.html?slug=${attrs.slug}">
                                <div>Lire la suite</div>
                                <div><i class="ion-ios-arrow-thin-right"></i></div>
                            </a>
                        </footer>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Render compact article card for sidebar
     */
    renderCompactArticle(article) {
        const attrs = article.attributes;
        const imageURL = this.api.getImageURL(attrs.featuredImage, 'small');
        const formattedDate = this.api.formatDate(attrs.publishedDate);
        
        return `
            <article class="article">
                <div class="inner">
                    <figure>
                        <a href="single.html?slug=${attrs.slug}">
                            <img src="${imageURL}" alt="${attrs.title}">
                        </a>
                    </figure>
                    <div class="padding">
                        <h4><a href="single.html?slug=${attrs.slug}">${attrs.title}</a></h4>
                        <div class="detail">
                            <div class="time">${formattedDate}</div>
                            <div class="category">
                                <a href="category.html?slug=${attrs.category?.data?.attributes?.slug || '#'}">
                                    ${attrs.category?.data?.attributes?.name || 'Uncategorized'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Render full article for single page
     */
    renderFullArticle(article) {
        const attrs = article.attributes;
        const imageURL = this.api.getImageURL(attrs.featuredImage, 'large');
        const categoryName = attrs.category?.data?.attributes?.name || 'Uncategorized';
        const categorySlug = attrs.category?.data?.attributes?.slug || '#';
        const authorName = attrs.author?.data?.attributes?.username || 'Anonymous';
        const formattedDate = this.api.formatDate(attrs.publishedDate);
        
        // Render tags
        const tagsHTML = attrs.tags?.data?.map(tag => 
            `<a href="search.html?tag=${tag.attributes.slug}">${tag.attributes.name}</a>`
        ).join(', ') || '';
        
        // Render gallery if exists
        let galleryHTML = '';
        if (attrs.gallery?.data && attrs.gallery.data.length > 0) {
            const galleryImages = attrs.gallery.data.map(img => {
                const imgURL = this.api.getImageURL({ data: img }, 'medium');
                return `
                    <div class="item">
                        <a href="${imgURL}" class="image-popup">
                            <img src="${imgURL}" alt="">
                        </a>
                    </div>
                `;
            }).join('');
            
            galleryHTML = `
                <div class="gallery">
                    <div class="owl-carousel owl-theme">
                        ${galleryImages}
                    </div>
                </div>
            `;
        }
        
        return `
            <article class="article main-article">
                <header>
                    <h1>${attrs.title}</h1>
                    <ul class="details">
                        <li><i class="ion-android-person"></i> ${authorName}</li>
                        <li><i class="ion-clock"></i> ${formattedDate}</li>
                        <li><i class="ion-android-folder"></i> <a href="category.html?slug=${categorySlug}">${categoryName}</a></li>
                        <li><i class="ion-eye"></i> ${attrs.views || 0} vues</li>
                        <li><i class="ion-heart"></i> ${attrs.likes || 0} likes</li>
                        ${attrs.readTime ? `<li><i class="ion-ios-clock"></i> ${attrs.readTime} min de lecture</li>` : ''}
                    </ul>
                </header>
                <div class="main">
                    <figure class="featured-image">
                        <img src="${imageURL}" alt="${attrs.title}">
                        ${attrs.imageCaption ? `<figcaption>${attrs.imageCaption}</figcaption>` : ''}
                    </figure>
                    ${attrs.excerpt ? `<p class="lead">${attrs.excerpt}</p>` : ''}
                    <div class="content">
                        ${attrs.content}
                    </div>
                    ${galleryHTML}
                </div>
                <footer>
                    ${tagsHTML ? `<div class="tags"><strong>Tags:</strong> ${tagsHTML}</div>` : ''}
                    <div class="share">
                        <strong>Partager:</strong>
                        <a href="#" class="facebook" onclick="shareArticle('facebook'); return false;"><i class="ion-social-facebook"></i></a>
                        <a href="#" class="twitter" onclick="shareArticle('twitter'); return false;"><i class="ion-social-twitter"></i></a>
                        <a href="#" class="google-plus" onclick="shareArticle('google'); return false;"><i class="ion-social-googleplus"></i></a>
                        <a href="#" class="linkedin" onclick="shareArticle('linkedin'); return false;"><i class="ion-social-linkedin"></i></a>
                    </div>
                </footer>
            </article>
        `;
    }

    /**
     * Render category card
     */
    renderCategoryCard(category) {
        const attrs = category.attributes;
        const articleCount = attrs.articles?.data?.length || 0;
        
        return `
            <li>
                <a href="category.html?slug=${attrs.slug}">
                    <div>${attrs.name}</div>
                    <div>${articleCount}</div>
                </a>
            </li>
        `;
    }

    /**
     * Render pagination
     */
    renderPagination(meta) {
        if (!meta || !meta.pagination) return '';
        
        const { page, pageCount, total } = meta.pagination;
        
        if (pageCount <= 1) return '';
        
        let paginationHTML = '<ul class="pagination">';
        
        // Previous button
        if (page > 1) {
            paginationHTML += `<li><a href="#" data-page="${page - 1}"><i class="ion-ios-arrow-left"></i></a></li>`;
        }
        
        // Page numbers
        for (let i = 1; i <= pageCount; i++) {
            if (i === page) {
                paginationHTML += `<li class="active"><a href="#">${i}</a></li>`;
            } else {
                paginationHTML += `<li><a href="#" data-page="${i}">${i}</a></li>`;
            }
        }
        
        // Next button
        if (page < pageCount) {
            paginationHTML += `<li><a href="#" data-page="${page + 1}"><i class="ion-ios-arrow-right"></i></a></li>`;
        }
        
        paginationHTML += '</ul>';
        
        return paginationHTML;
    }

    /**
     * Render breaking news ticker
     */
    renderBreakingNews(articles) {
        if (!articles || articles.length === 0) return '';
        
        const newsItems = articles.map(article => {
            const attrs = article.attributes;
            return `
                <div class="item">
                    <a href="single.html?slug=${attrs.slug}">${attrs.title}</a>
                </div>
            `;
        }).join('');
        
        return `
            <div class="breaking-news">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="ticker">
                                <div class="ticker-label">
                                    <i class="ion-flash"></i>
                                    <span>Breaking News</span>
                                </div>
                                <div class="ticker-content">
                                    ${newsItems}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the content renderer
const strapiRenderer = new StrapiContentRenderer(strapiAPI);
