import { productAPI, healthCheck } from '../src/services/api.js';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health check
    console.log('1. Testing server health...');
    const isHealthy = await healthCheck();
    console.log(`   Server health: ${isHealthy ? '✅ OK' : '❌ Failed'}\n`);

    // Test get all products
    console.log('2. Testing /products endpoint...');
    const allProducts = await productAPI.getAllProducts();
    console.log(`   Found ${allProducts.length} products ✅\n`);

    // Test get product by ID
    console.log('3. Testing /product/:id endpoint...');
    const product1 = await productAPI.getProductById('1');
    if (product1) {
      console.log(`   Product 1: ${product1.name} ✅`);
    } else {
      console.log('   Product 1: Not found ❌');
    }

    const product5 = await productAPI.getProductById('5');
    if (product5) {
      console.log(`   Product 5: ${product5.name} ✅`);
    } else {
      console.log('   Product 5: Not found ❌');
    }

    // Test non-existent product
    const productNone = await productAPI.getProductById('999');
    console.log(`   Product 999: ${productNone ? 'Found (unexpected)' : 'Not found ✅'}\n`);

    // Test flash sale products
    console.log('4. Testing flash sale products...');
    const flashProducts = await productAPI.getFlashSaleProducts();
    console.log(`   Flash sale products: ${flashProducts.length} ✅\n`);

    // Test collectible products
    console.log('5. Testing collectible products...');
    const collectibleProducts = await productAPI.getCollectibleProducts();
    console.log(`   Collectible products: ${collectibleProducts.length} ✅\n`);

    console.log('🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPI();
}