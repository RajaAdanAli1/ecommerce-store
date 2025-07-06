const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, closeConnection, clearDatabase } = require('./database');

// Import models
const Product = require('./models/Product');
const User = require('./models/User');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    address: {
      street: '123 Admin St',
      city: 'Admin City',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    phone: '+1-555-0001'
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    address: {
      street: '456 User Ave',
      city: 'User City',
      state: 'NY',
      zipCode: '67890',
      country: 'USA'
    },
    phone: '+1-555-0002'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'user',
    address: {
      street: '789 Customer Blvd',
      city: 'Customer City',
      state: 'FL',
      zipCode: '54321',
      country: 'USA'
    },
    phone: '+1-555-0003'
  }
];

const sampleProducts = [
  // Electronics
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with Pro camera system, A17 Pro chip, and titanium design.',
    price: 999.99,
    originalPrice: 1099.99,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    ],
    stock: 50,
    specifications: new Map([
      ['Storage', '256GB'],
      ['RAM', '8GB'],
      ['Display', '6.1-inch Super Retina XDR'],
      ['Camera', '48MP Main Camera'],
      ['Battery', 'Up to 23 hours video playback']
    ]),
    tags: ['smartphone', 'apple', 'pro', 'camera'],
    featured: true,
    discount: 9
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features.',
    price: 1199.99,
    originalPrice: 1299.99,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=500'
    ],
    stock: 35,
    specifications: new Map([
      ['Storage', '512GB'],
      ['RAM', '12GB'],
      ['Display', '6.8-inch Dynamic AMOLED 2X'],
      ['Camera', '200MP Main Camera'],
      ['S Pen', 'Included']
    ]),
    tags: ['smartphone', 'samsung', 'android', 's-pen'],
    featured: true,
    discount: 8
  },
  {
    name: 'MacBook Pro 16-inch',
    description: 'Powerful laptop with M3 Pro chip, perfect for professionals and creatives.',
    price: 2499.99,
    originalPrice: 2699.99,
    category: 'electronics',
    subcategory: 'laptops',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
    ],
    stock: 25,
    specifications: new Map([
      ['Processor', 'M3 Pro chip'],
      ['RAM', '18GB'],
      ['Storage', '512GB SSD'],
      ['Display', '16.2-inch Liquid Retina XDR'],
      ['Battery', 'Up to 22 hours']
    ]),
    tags: ['laptop', 'apple', 'macbook', 'professional'],
    featured: true,
    discount: 7
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with premium sound.',
    price: 349.99,
    originalPrice: 399.99,
    category: 'electronics',
    subcategory: 'headphones',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    stock: 75,
    specifications: new Map([
      ['Battery Life', '30 hours'],
      ['Noise Cancelling', 'Industry Leading'],
      ['Connectivity', 'Bluetooth 5.2, NFC'],
      ['Weight', '250g'],
      ['Quick Charge', '3 min for 3 hours playback']
    ]),
    tags: ['headphones', 'wireless', 'noise-cancelling', 'sony'],
    featured: false,
    discount: 12
  },

  // Clothing
  {
    name: 'Nike Air Jordan 1 Retro High',
    description: 'Classic basketball sneaker with premium leather and iconic design.',
    price: 170.00,
    originalPrice: 180.00,
    category: 'clothing',
    subcategory: 'shoes',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
    ],
    stock: 100,
    specifications: new Map([
      ['Material', 'Premium Leather'],
      ['Sole', 'Rubber'],
      ['Closure', 'Laces'],
      ['Style', 'High-top'],
      ['Sizes', '7-13 US']
    ]),
    tags: ['shoes', 'sneakers', 'basketball', 'jordan'],
    featured: true,
    discount: 6
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original straight fit jeans with button fly and classic 5-pocket styling.',
    price: 79.99,
    originalPrice: 89.99,
    category: 'clothing',
    subcategory: 'jeans',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'
    ],
    stock: 150,
    specifications: new Map([
      ['Fit', 'Straight'],
      ['Rise', 'Mid-rise'],
      ['Material', '100% Cotton'],
      ['Closure', 'Button fly'],
      ['Wash', 'Medium stonewash']
    ]),
    tags: ['jeans', 'denim', 'classic', 'straight-fit'],
    featured: false,
    discount: 11
  },

  // Books
  {
    name: 'The Complete Guide to JavaScript',
    description: 'Comprehensive guide to modern JavaScript development and best practices.',
    price: 49.99,
    originalPrice: 59.99,
    category: 'books',
    subcategory: 'programming',
    brand: 'TechBooks',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
    ],
    stock: 80,
    specifications: new Map([
      ['Pages', '850'],
      ['Language', 'English'],
      ['Format', 'Paperback'],
      ['Publisher', 'TechBooks Publishing'],
      ['Edition', '5th Edition']
    ]),
    tags: ['programming', 'javascript', 'web-development', 'tutorial'],
    featured: false,
    discount: 17
  },

  // Home & Garden
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Powerful cordless vacuum with laser dust detection and scientific proof of deep clean.',
    price: 649.99,
    originalPrice: 749.99,
    category: 'home',
    subcategory: 'appliances',
    brand: 'Dyson',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=500'
    ],
    stock: 40,
    specifications: new Map([
      ['Battery Life', 'Up to 60 minutes'],
      ['Suction Power', '230 AW'],
      ['Bin Capacity', '0.77L'],
      ['Weight', '3.1kg'],
      ['Filtration', 'Advanced whole-machine filtration']
    ]),
    tags: ['vacuum', 'cordless', 'home-appliance', 'cleaning'],
    featured: true,
    discount: 13
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat Premium Pro',
    description: 'High-quality yoga mat with superior grip and cushioning for all types of yoga.',
    price: 89.99,
    originalPrice: 109.99,
    category: 'sports',
    subcategory: 'fitness',
    brand: 'YogaPro',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      'https://images.unsplash.com/photo-1506629905061-6d4157788d96?w=500'
    ],
    stock: 120,
    specifications: new Map([
      ['Material', 'Natural Rubber'],
      ['Thickness', '6mm'],
      ['Dimensions', '183cm x 68cm'],
      ['Weight', '2.5kg'],
      ['Grip', 'Anti-slip surface']
    ]),
    tags: ['yoga', 'fitness', 'exercise', 'meditation'],
    featured: false,
    discount: 18
  },

  // Beauty & Personal Care
  {
    name: 'Skincare Essentials Kit',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'beauty',
    subcategory: 'skincare',
    brand: 'BeautyLab',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'
    ],
    stock: 90,
    specifications: new Map([
      ['Skin Type', 'All skin types'],
      ['Contents', '4 products'],
      ['Volume', '150ml each'],
      ['Ingredients', 'Natural and organic'],
      ['Cruelty Free', 'Yes']
    ]),
    tags: ['skincare', 'beauty', 'organic', 'routine'],
    featured: true,
    discount: 19
  }
];

// Function to seed users
const seedUsers = async () => {
  try {
    console.log('Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create users
    const users = await User.create(sampleUsers);
    console.log(`✓ Created ${users.length} users`);
    
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Function to seed products
const seedProducts = async () => {
  try {
    console.log('Seeding products...');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Create products
    const products = await Product.create(sampleProducts);
    console.log(`✓ Created ${products.length} products`);
    
    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Function to add sample reviews to products
const seedReviews = async (users, products) => {
  try {
    console.log('Adding sample reviews...');
    
    const sampleReviews = [
      {
        user: users[1]._id, // John Doe
        rating: 5,
        comment: 'Excellent product! Highly recommend it.'
      },
      {
        user: users[2]._id, // Jane Doe
        rating: 4,
        comment: 'Great quality and fast shipping.'
      },
      {
        user: users[1]._id, // John Doe
        rating: 5,
        comment: 'Perfect! Exactly what I was looking for.'
      }
    ];
    
    // Add reviews to first few products
    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per product
      
      for (let j = 0; j < numReviews; j++) {
        const review = {
          ...sampleReviews[j % sampleReviews.length],
          rating: Math.floor(Math.random() * 2) + 4 // 4-5 stars
        };
        
        product.reviews.push(review);
      }
      
      // Update rating
      product.updateRating();
      await product.save();
    }
    
    console.log('✓ Added sample reviews to products');
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await clearDatabase();
    
    // Seed data
    const users = await seedUsers();
    const products = await seedProducts();
    await seedReviews(users, products);
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 Summary:
- Users: ${users.length}
- Products: ${products.length}
- Categories: ${[...new Set(products.map(p => p.category))].length}
- Featured Products: ${products.filter(p => p.featured).length}
    `);
    
    // Display sample login credentials
    console.log(`
🔑 Sample Login Credentials:
Admin User:
- Username: admin
- Email: admin@ecommerce.com
- Password: admin123

Regular User:
- Username: johndoe
- Email: john@example.com
- Password: password123
    `);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedUsers,
  seedProducts,
  seedReviews,
  sampleUsers,
  sampleProducts
};