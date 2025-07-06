const mongoose = require('mongoose');
const { connectDB, closeConnection, clearDatabase } = require('./database');

// Import models
const Product = require('./models/Product');
const User = require('./models/User');

// Advanced seeding with more realistic data
const advancedSampleProducts = [
  // Electronics - High-end
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'The ultimate iPhone with titanium design, Action button, and the most advanced Pro camera system ever.',
    price: 1199.99,
    originalPrice: 1299.99,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'
    ],
    stock: 45,
    specifications: new Map([
      ['Storage', '256GB'],
      ['RAM', '8GB'],
      ['Display', '6.7-inch Super Retina XDR'],
      ['Camera', '48MP Main + 12MP Ultra Wide + 12MP Telephoto'],
      ['Battery', 'Up to 29 hours video playback'],
      ['Material', 'Titanium'],
      ['Water Resistance', 'IP68']
    ]),
    tags: ['smartphone', 'apple', 'pro', 'titanium', '5G'],
    featured: true,
    discount: 8
  },
  
  {
    name: 'Samsung 65" OLED 4K Smart TV',
    description: 'Quantum Dot OLED technology with Neural Quantum Processor 4K and Dolby Atmos.',
    price: 2499.99,
    originalPrice: 2999.99,
    category: 'electronics',
    subcategory: 'televisions',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500'
    ],
    stock: 20,
    specifications: new Map([
      ['Screen Size', '65 inches'],
      ['Resolution', '4K UHD (3840 x 2160)'],
      ['Display Type', 'Quantum Dot OLED'],
      ['Smart Platform', 'Tizen OS'],
      ['HDR', 'HDR10+ / Dolby Vision'],
      ['Audio', 'Dolby Atmos'],
      ['Connectivity', 'Wi-Fi 6, Bluetooth 5.2, 4x HDMI']
    ]),
    tags: ['television', 'oled', '4k', 'smart-tv', 'quantum-dot'],
    featured: true,
    discount: 17
  },

  {
    name: 'Dell XPS 13 Plus',
    description: 'Ultra-thin laptop with 13.4" InfinityEdge display and Intel Evo platform.',
    price: 1399.99,
    originalPrice: 1599.99,
    category: 'electronics',
    subcategory: 'laptops',
    brand: 'Dell',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'
    ],
    stock: 30,
    specifications: new Map([
      ['Processor', 'Intel Core i7-1360P'],
      ['RAM', '16GB LPDDR5'],
      ['Storage', '512GB NVMe SSD'],
      ['Display', '13.4" FHD+ InfinityEdge'],
      ['Graphics', 'Intel Iris Xe'],
      ['Battery', 'Up to 12 hours'],
      ['Weight', '2.73 lbs']
    ]),
    tags: ['laptop', 'ultrabook', 'dell', 'intel-evo', 'portable'],
    featured: true,
    discount: 12
  },

  // Fashion & Apparel
  {
    name: 'Nike Air Max 270',
    description: 'Lifestyle sneaker with large Max Air unit and modern design.',
    price: 150.00,
    originalPrice: 170.00,
    category: 'clothing',
    subcategory: 'sneakers',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
    ],
    stock: 85,
    specifications: new Map([
      ['Upper Material', 'Mesh and synthetic'],
      ['Sole', 'Rubber with Max Air cushioning'],
      ['Closure', 'Lace-up'],
      ['Style', 'Low-top lifestyle'],
      ['Available Sizes', '6-14 US'],
      ['Colors', 'Multiple colorways available']
    ]),
    tags: ['sneakers', 'lifestyle', 'air-max', 'comfortable', 'casual'],
    featured: false,
    discount: 12
  },

  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoe with BOOST midsole and Primeknit upper.',
    price: 190.00,
    originalPrice: 210.00,
    category: 'clothing',
    subcategory: 'running-shoes',
    brand: 'Adidas',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'
    ],
    stock: 70,
    specifications: new Map([
      ['Upper', 'Primeknit textile'],
      ['Midsole', 'BOOST energy return'],
      ['Outsole', 'Continental rubber'],
      ['Drop', '10mm'],
      ['Weight', '10.9 oz (men\'s size 9)'],
      ['Use', 'Running, training']
    ]),
    tags: ['running-shoes', 'boost', 'primeknit', 'performance', 'comfortable'],
    featured: true,
    discount: 10
  },

  // Home & Kitchen
  {
    name: 'KitchenAid Stand Mixer',
    description: 'Professional 5-quart stand mixer with 10 speeds and tilt-head design.',
    price: 449.99,
    originalPrice: 499.99,
    category: 'home',
    subcategory: 'kitchen-appliances',
    brand: 'KitchenAid',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
      'https://images.unsplash.com/photo-1584950334075-2b8c59c5b685?w=500'
    ],
    stock: 25,
    specifications: new Map([
      ['Bowl Capacity', '5 quarts'],
      ['Motor', '325 watts'],
      ['Speeds', '10 speeds'],
      ['Attachments', 'Flat beater, dough hook, wire whip'],
      ['Construction', 'All-metal'],
      ['Colors', 'Multiple colors available']
    ]),
    tags: ['kitchen', 'mixer', 'baking', 'professional', 'kitchenaid'],
    featured: true,
    discount: 10
  },

  {
    name: 'Ninja Foodi Personal Blender',
    description: 'Personal blender with Auto-iQ technology and to-go cups.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'home',
    subcategory: 'small-appliances',
    brand: 'Ninja',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500',
      'https://images.unsplash.com/photo-1563379091339-03246963d4b6?w=500'
    ],
    stock: 60,
    specifications: new Map([
      ['Motor', '1000 watts'],
      ['Cups', '2 x 24oz to-go cups'],
      ['Blades', 'Pro Extractor Blades'],
      ['Programs', 'Auto-iQ technology'],
      ['BPA Free', 'Yes'],
      ['Dishwasher Safe', 'Yes (cups and lids)']
    ]),
    tags: ['blender', 'personal', 'smoothies', 'portable', 'ninja'],
    featured: false,
    discount: 20
  },

  // Books & Education
  {
    name: 'Full-Stack Web Development Course',
    description: 'Complete guide to modern web development with React, Node.js, and MongoDB.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'books',
    subcategory: 'programming',
    brand: 'CodeMaster',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
    ],
    stock: 200,
    specifications: new Map([
      ['Format', 'Digital + Physical'],
      ['Pages', '1200+'],
      ['Projects', '15 hands-on projects'],
      ['Technologies', 'React, Node.js, MongoDB, Express'],
      ['Level', 'Beginner to Advanced'],
      ['Updates', 'Lifetime updates included']
    ]),
    tags: ['programming', 'web-development', 'full-stack', 'react', 'nodejs'],
    featured: true,
    discount: 31
  },

  // Sports & Fitness
  {
    name: 'Bowflex SelectTech Dumbbells',
    description: 'Adjustable dumbbells that replace 15 sets of weights.',
    price: 549.99,
    originalPrice: 649.99,
    category: 'sports',
    subcategory: 'fitness-equipment',
    brand: 'Bowflex',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
    ],
    stock: 40,
    specifications: new Map([
      ['Weight Range', '5-52.5 lbs per dumbbell'],
      ['Increments', '2.5 lb increments up to 25 lbs'],
      ['Space Saving', 'Replaces 15 sets of weights'],
      ['Adjustment', 'Quick dial system'],
      ['Warranty', '2 years'],
      ['Dimensions', '16.9" L x 8.3" W x 9" H']
    ]),
    tags: ['fitness', 'dumbbells', 'adjustable', 'home-gym', 'space-saving'],
    featured: true,
    discount: 15
  },

  // Beauty & Personal Care
  {
    name: 'Dyson Supersonic Hair Dryer',
    description: 'Professional hair dryer with intelligent heat control and multiple attachments.',
    price: 429.99,
    originalPrice: 479.99,
    category: 'beauty',
    subcategory: 'hair-care',
    brand: 'Dyson',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'
    ],
    stock: 35,
    specifications: new Map([
      ['Motor', 'Dyson digital motor V9'],
      ['Heat Control', 'Intelligent heat control'],
      ['Attachments', '5 styling attachments'],
      ['Weight', '1.8 lbs'],
      ['Cord Length', '9.8 ft'],
      ['Warranty', '2 years']
    ]),
    tags: ['hair-dryer', 'professional', 'dyson', 'hair-care', 'styling'],
    featured: true,
    discount: 10
  }
];

// Advanced user data with more realistic profiles
const advancedSampleUsers = [
  {
    username: 'admin',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    address: {
      street: '123 Commerce Plaza',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    phone: '+1-555-ADMIN'
  },
  {
    username: 'john_smith',
    email: 'john.smith@email.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Smith',
    role: 'user',
    address: {
      street: '456 Maple Avenue',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    phone: '+1-555-0123'
  },
  {
    username: 'sarah_wilson',
    email: 'sarah.wilson@email.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'user',
    address: {
      street: '789 Oak Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    phone: '+1-555-0456'
  },
  {
    username: 'mike_johnson',
    email: 'mike.johnson@email.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'user',
    address: {
      street: '321 Pine Road',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    phone: '+1-555-0789'
  },
  {
    username: 'emma_davis',
    email: 'emma.davis@email.com',
    password: 'password123',
    firstName: 'Emma',
    lastName: 'Davis',
    role: 'user',
    address: {
      street: '654 Elm Circle',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    phone: '+1-555-0321'
  }
];

// Function to generate realistic reviews
const generateReviews = (users, productCount) => {
  const reviewTemplates = [
    {
      ratings: [5, 5, 4, 5],
      comments: [
        "Outstanding product! Exceeded my expectations in every way.",
        "Perfect quality and fast shipping. Highly recommend!",
        "Excellent build quality and great value for money.",
        "Amazing product, works exactly as described."
      ]
    },
    {
      ratings: [4, 4, 5, 4],
      comments: [
        "Great product overall, very satisfied with my purchase.",
        "Good quality and reasonable price point.",
        "Works well and arrived quickly. Would buy again.",
        "Solid product with good performance."
      ]
    },
    {
      ratings: [3, 4, 3, 4],
      comments: [
        "Decent product but could be better in some areas.",
        "It's okay, meets basic expectations.",
        "Good value but not exceptional quality.",
        "Average product, nothing special but functional."
      ]
    }
  ];

  const reviews = [];
  
  for (let i = 0; i < productCount; i++) {
    const numReviews = Math.floor(Math.random() * 5) + 1; // 1-5 reviews per product
    const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    
    for (let j = 0; j < numReviews; j++) {
      reviews.push({
        productIndex: i,
        user: users[Math.floor(Math.random() * users.length)]._id,
        rating: template.ratings[Math.floor(Math.random() * template.ratings.length)],
        comment: template.comments[Math.floor(Math.random() * template.comments.length)]
      });
    }
  }
  
  return reviews;
};

// Advanced seeding function
const seedAdvancedData = async () => {
  try {
    console.log('🚀 Starting advanced database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await clearDatabase();
    
    // Seed users
    console.log('👥 Creating users...');
    const users = await User.create(advancedSampleUsers);
    console.log(`✅ Created ${users.length} users`);
    
    // Seed products
    console.log('📦 Creating products...');
    const products = await Product.create(advancedSampleProducts);
    console.log(`✅ Created ${products.length} products`);
    
    // Generate and add reviews
    console.log('⭐ Adding reviews...');
    const reviews = generateReviews(users, products.length);
    
    for (const review of reviews) {
      const product = products[review.productIndex];
      product.reviews.push({
        user: review.user,
        rating: review.rating,
        comment: review.comment
      });
      
      product.updateRating();
      await product.save();
    }
    
    console.log(`✅ Added ${reviews.length} reviews`);
    
    // Generate statistics
    const stats = {
      totalUsers: users.length,
      totalProducts: products.length,
      totalReviews: reviews.length,
      categories: [...new Set(products.map(p => p.category))],
      brands: [...new Set(products.map(p => p.brand))],
      featuredProducts: products.filter(p => p.featured).length,
      averagePrice: (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2),
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)
    };
    
    console.log(`
🎉 Advanced database seeding completed successfully!

📊 Detailed Statistics:
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE SUMMARY                      │
├─────────────────────────────────────────────────────────────┤
│ Users Created:           ${stats.totalUsers.toString().padStart(3)} users                      │
│ Products Created:        ${stats.totalProducts.toString().padStart(3)} products                   │
│ Reviews Added:           ${stats.totalReviews.toString().padStart(3)} reviews                    │
│ Categories:              ${stats.categories.length.toString().padStart(3)} categories                │
│ Brands:                  ${stats.brands.length.toString().padStart(3)} brands                     │
│ Featured Products:       ${stats.featuredProducts.toString().padStart(3)} products                   │
│ Average Product Price:   $${stats.averagePrice.padStart(7)}                    │
│ Total Inventory Value:   $${stats.totalValue.padStart(10)}                 │
└─────────────────────────────────────────────────────────────┘

📂 Categories: ${stats.categories.join(', ')}
🏷️  Brands: ${stats.brands.join(', ')}

🔑 Login Credentials:
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN ACCOUNT                          │
├─────────────────────────────────────────────────────────────┤
│ Username: admin                                             │
│ Email:    admin@ecommerce.com                               │
│ Password: admin123                                          │
│ Role:     Administrator                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      TEST USER ACCOUNTS                     │
├─────────────────────────────────────────────────────────────┤
│ Username: john_smith                                        │
│ Email:    john.smith@email.com                              │
│ Password: password123                                       │
│ Role:     User                                              │
├─────────────────────────────────────────────────────────────┤
│ Username: sarah_wilson                                      │
│ Email:    sarah.wilson@email.com                            │
│ Password: password123                                       │
│ Role:     User                                              │
└─────────────────────────────────────────────────────────────┘

🎯 Next Steps:
1. Run 'npm run dev' to start the server
2. Open http://localhost:3000 in your browser
3. Use the admin credentials to access admin features
4. Test user registration and login functionality
    `);
    
  } catch (error) {
    console.error('❌ Error during advanced seeding:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedAdvancedData();
}

module.exports = {
  seedAdvancedData,
  advancedSampleUsers,
  advancedSampleProducts
};
