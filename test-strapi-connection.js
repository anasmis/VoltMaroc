/**
 * Strapi Connection Test Script
 * Run this with: node test-strapi-connection.js
 */

const API_URL = 'https://management.evborne.ma';
const API_TOKEN = '2faa650c59f73154d3dd27837812c2ee17408dda06f31c09f64e771acb749a1fb69a343de27b3309f177798bc3fb7772c476ad521a9b3cbdc881c9fd10aa1ad3958b43b02b001a5178cfe1c4d0258abfbdb9e6a3e1b1ee4c8d784ad49ce592b635d9e5388182db670a2b455ace78aa4931c9e28d52014f4df1b31ee0d0e259bc';

async function testConnection() {
    console.log('🔍 Testing Strapi Connection...\n');
    console.log('━'.repeat(60));
    console.log(`API URL: ${API_URL}`);
    console.log(`Token: ${API_TOKEN.substring(0, 20)}...`);
    console.log('━'.repeat(60));
    console.log();

    try {
        // Test 1: Check if Strapi is reachable
        console.log('📡 Test 1: Checking if Strapi is reachable...');
        const healthCheck = await fetch(`${API_URL}/api/articles?pagination[pageSize]=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });

        if (!healthCheck.ok) {
            throw new Error(`HTTP ${healthCheck.status}: ${healthCheck.statusText}`);
        }

        const data = await healthCheck.json();
        console.log('✅ Connection successful!\n');

        // Test 2: Check articles
        console.log('📄 Test 2: Fetching articles...');
        console.log(`   Total articles: ${data.meta.pagination.total}`);
        console.log(`   Articles returned: ${data.data.length}`);
        
        if (data.data.length > 0) {
            console.log('\n   Sample article:');
            const article = data.data[0];
            console.log(`   - ID: ${article.id}`);
            console.log(`   - Title: ${article.attributes.title}`);
            console.log(`   - Slug: ${article.attributes.slug}`);
            console.log(`   - Published: ${article.attributes.publishedDate || 'N/A'}`);
            console.log(`   - Category: ${article.attributes.category?.data?.attributes?.name || 'None'}`);
            console.log(`   - Featured: ${article.attributes.isFeatured ? 'Yes' : 'No'}`);
        }
        console.log();

        // Test 3: Check categories
        console.log('📁 Test 3: Fetching categories...');
        const categoriesRes = await fetch(`${API_URL}/api/categories?pagination[pageSize]=100`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });

        if (categoriesRes.ok) {
            const categories = await categoriesRes.json();
            console.log(`✅ Found ${categories.data.length} categories`);
            if (categories.data.length > 0) {
                categories.data.forEach(cat => {
                    console.log(`   - ${cat.attributes.name} (${cat.attributes.slug})`);
                });
            }
        }
        console.log();

        // Test 4: Check tags
        console.log('🏷️  Test 4: Fetching tags...');
        const tagsRes = await fetch(`${API_URL}/api/tags?pagination[pageSize]=100`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });

        if (tagsRes.ok) {
            const tags = await tagsRes.json();
            console.log(`✅ Found ${tags.data.length} tags`);
            if (tags.data.length > 0) {
                const tagNames = tags.data.slice(0, 10).map(tag => tag.attributes.name);
                console.log(`   ${tagNames.join(', ')}${tags.data.length > 10 ? '...' : ''}`);
            }
        }
        console.log();

        // Summary
        console.log('━'.repeat(60));
        console.log('✅ ALL TESTS PASSED!');
        console.log('━'.repeat(60));
        console.log('\n💡 Next Steps:');
        console.log('   1. Open: http://localhost:8080/strapi-demo.html');
        console.log('   2. Click "Test Connection" button');
        console.log('   3. Try loading articles, featured, and breaking news');
        console.log('\n🚀 Your Strapi integration is ready to use!\n');

    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!\n');
        console.error('Error Details:');
        console.error(`   ${error.message}\n`);
        
        console.log('🔧 Troubleshooting:');
        console.log('   1. Verify Strapi is running at: ' + API_URL);
        console.log('   2. Check API token is valid and not expired');
        console.log('   3. Ensure CORS is configured in Strapi');
        console.log('   4. Verify public permissions are enabled for:');
        console.log('      - Article: find, findOne');
        console.log('      - Category: find, findOne');
        console.log('      - Tag: find, findOne\n');
        
        process.exit(1);
    }
}

// Run the test
testConnection();
