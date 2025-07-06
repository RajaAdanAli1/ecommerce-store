const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

// Import database connection
const { connectDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize server after database connection
async function startServer() {
  try {
    // Connect to database first
    await connectDB();
    
    // Session configuration - only after DB is connected
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
        mongoOptions: {
          directConnection: false,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          family: 4, // Use IPv4
        }
      }),
      cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
      }
    }));

    // Routes
    const authRoutes = require('./routes/auth');
    const productRoutes = require('./routes/products');
    const cartRoutes = require('./routes/cart');
    const orderRoutes = require('./routes/orders');

    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);

    // Serve static files
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    app.get('/register', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'register.html'));
    });

    app.get('/cart', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'cart.html'));
    });

    app.get('/product/:id', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'product.html'));
    });

    app.get('/checkout', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
    });

    // Start server only after database connection is established
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
