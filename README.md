# 🛒 EcommShop - Complete E-commerce Store

A full-featured e-commerce web application built with Express.js, MongoDB, and vanilla JavaScript. This project includes all essential e-commerce features including user authentication, product management, shopping cart, and order processing with a modern, responsive design.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Live Demo
*Add your live demo link here*

## 📸 Screenshots
*Add screenshots of your application here*

## 🚀 Features

### 🛍️ Core E-commerce Features
- **Product Catalog**: Browse products with filtering, sorting, and search functionality
- **Product Details**: Comprehensive product pages with images, specifications, and reviews
- **Shopping Cart**: Add, remove, and update items with persistent cart storage
- **User Authentication**: Secure registration, login, and session management
- **Order Processing**: Complete checkout process with order management and history
- **User Reviews**: Add and view product reviews with star ratings
- **Admin Dashboard**: Product and order management (if admin features are implemented)

### 🔧 Technical Features
- **Responsive Design**: Mobile-first approach that works seamlessly on all devices
- **REST API**: Clean RESTful API architecture with proper HTTP methods
- **Database**: MongoDB with Mongoose ODM for efficient data management
- **Security**: Password hashing, input validation, and secure session management
- **Modern UI**: Clean, professional interface with smooth animations and transitions
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 📦 Product Management
- **Multiple Categories**: Electronics, Clothing, Books, Home, Sports, Beauty, Toys, Automotive
- **Advanced Search**: Search by name, category, brand, and price range
- **Smart Filtering**: Filter products by multiple criteria simultaneously
- **Sorting Options**: Sort by price, rating, date added, and featured status
- **Pagination**: Efficient browsing with pagination for large product catalogs
- **Stock Management**: Real-time inventory tracking and stock status

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & Session-based authentication
- **Security**: bcrypt for password hashing, express-validator for input validation
- **File Upload**: Multer for handling file uploads

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome or similar icon library
- **Responsive**: Mobile-first responsive design

### Development Tools
- **Process Manager**: nodemon for development
- **Environment**: dotenv for environment variables
- **Version Control**: Git with comprehensive .gitignore
- **Package Manager**: npm

### 🛒 Shopping Experience
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout Process**: Multi-step checkout with shipping and payment
- **Order History**: View past orders and order status
- **Wishlist**: Save products for later (placeholder)
- **Product Reviews**: Rate and review products

## 🏗️ Architecture

### Backend (Express.js)
```
├── server.js              # Main server file
├── models/               # Database models
│   ├── User.js          # User model
│   ├── Product.js       # Product model
│   ├── Cart.js          # Shopping cart model
│   └── Order.js         # Order model
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product routes
│   ├── cart.js          # Cart routes
│   └── orders.js        # Order routes
└── seed.js              # Database seeding script
```

### Frontend (HTML/CSS/JavaScript)
```
├── public/
│   ├── index.html       # Homepage
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   ├── cart.html        # Shopping cart
│   ├── product.html     # Product details
│   ├── checkout.html    # Checkout process
│   ├── css/
│   │   └── styles.css   # All styles
│   └── js/
│       ├── app.js       # Main application logic
│       ├── auth.js      # Authentication logic
│       ├── cart.js      # Cart functionality
│       ├── product.js   # Product page logic
│       └── checkout.js  # Checkout process
```

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or cloud instance) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/RajaAdanAli1/ecommerce-store.git
cd ecommerce-store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce
# For MongoDB Atlas (cloud): mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce

# Security Keys
SESSION_SECRET=your-super-secure-session-secret-key-here
JWT_SECRET=your-jwt-secret-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: For email notifications (if implemented)
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

**Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Database Setup
#### Option 1: Local MongoDB
Start your local MongoDB instance:
```bash
# On Windows
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb/brew/mongodb-community

# On Linux
sudo systemctl start mongod
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and add it to your `.env` file
4. Make sure to whitelist your IP address

### 5. Initialize Database with Sample Data
```bash
# Check database connection
npm run check-connection

# Seed the database with sample data
npm run seed

# Or use the improved seed script
npm run seed-improved

# Or run both connection check and seeding
npm run setup-db
```

### 6. Start the Application
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 🔐 Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `SESSION_SECRET` | Secret key for session encryption | `your-super-secure-session-secret` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-jwt-secret-key` |
| `PORT` | Port number for the server | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Email for notifications | `your-email@gmail.com` |
| `EMAIL_PASS` | Email password/app password | `your-app-password` |

## 💾 Database Setup

### Local MongoDB Setup
1. Install MongoDB Community Server
2. Start MongoDB service
3. The application will automatically create the database and collections

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and cluster
3. Create database user with read/write permissions
4. Add your IP address to the whitelist
5. Get connection string and add to `.env`

## 🔐 Default Login Credentials

After running the seed script, you can use these test credentials:

**Admin User:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

## 🚦 Usage

### Running the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Check database connection
npm run check-connection

# Seed database with sample data
npm run seed

# Complete setup (check connection + seed)
npm run setup-db
```

### Accessing the Application
- **Homepage**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin` (if implemented)
- **API Base URL**: `http://localhost:3000/api`

### Testing the Application
1. Visit `http://localhost:3000`
2. Register a new account or use the provided test credentials
3. Browse products and add items to cart
4. Complete the checkout process
5. View order history in your account

## 📁 Project Structure

```
ecommerce-store/
├── 📁 models/                 # Database models
│   ├── User.js               # User model and schema
│   ├── Product.js            # Product model and schema
│   ├── Cart.js               # Shopping cart model
│   └── Order.js              # Order model and schema
├── 📁 routes/                # API route handlers
│   ├── auth.js               # Authentication routes
│   ├── products.js           # Product management routes
│   ├── cart.js               # Shopping cart routes
│   └── orders.js             # Order management routes
├── 📁 public/                # Static frontend files
│   ├── index.html            # Homepage
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── cart.html             # Shopping cart page
│   ├── product.html          # Product details page
│   ├── checkout.html         # Checkout page
│   ├── about.html            # About page
│   ├── contact.html          # Contact page
│   ├── 📁 css/
│   │   └── styles.css        # Application styles
│   └── 📁 js/
│       ├── app.js            # Main application logic
│       ├── auth.js           # Authentication handling
│       ├── cart.js           # Cart functionality
│       ├── product.js        # Product page logic
│       └── checkout.js       # Checkout process
├── server.js                 # Main server file
├── database.js               # Database connection and utilities
├── seed.js                   # Database seeding script
├── seed-improved.js          # Enhanced seeding script
├── check-connection.js       # Database connection checker
├── check-current-ip.js       # IP address utility
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering/sorting)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/brands` - Get product brands
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

## 🎨 UI Components

### Homepage
- Hero section with call-to-action
- Featured products carousel
- Category grid
- Product filtering and search
- Product grid with pagination

### Product Details
- Image gallery with thumbnails
- Product information and pricing
- Add to cart functionality
- Product tabs (Description, Specifications, Reviews)
- Related products section

### Shopping Cart
- Cart items with quantity controls
- Price calculations (subtotal, tax, shipping)
- Order summary
- Checkout button

### Checkout Process
- Multi-step checkout (Shipping → Payment → Review)
- Address forms with validation
- Payment method selection
- Order confirmation

## 🔧 Customization

### Adding New Product Categories
1. Update the `category` enum in `models/Product.js`
2. Add category icon mapping in `js/app.js`
3. Update the category display logic

### Modifying Styles
- All styles are in `public/css/styles.css`
- CSS variables for easy theme customization
- Responsive breakpoints for mobile optimization

### Adding New Features
- Follow the existing pattern for new API endpoints
- Add corresponding frontend JavaScript functions
- Update the UI components as needed

## 📝 Sample Data

The seed script creates:
- **10 sample products** across different categories
- **2 users** (admin and regular user)
- **Product reviews** for featured items
- **Complete product specifications** and images

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment

#### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
SESSION_SECRET=your-super-secure-session-secret-production
JWT_SECRET=your-jwt-secret-production
PORT=3000
```

#### Deployment Platforms

**Heroku:**
1. Create a new Heroku app
2. Set environment variables in Heroku Config Vars
3. Deploy using Git or GitHub integration

**Railway:**
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically with each push

**DigitalOcean App Platform:**
1. Create a new app from GitHub
2. Configure environment variables
3. Set build and run commands

**Self-hosted (VPS):**
1. Install Node.js and MongoDB on your server
2. Clone repository and install dependencies
3. Set up environment variables
4. Use PM2 for process management
5. Configure reverse proxy (Nginx/Apache)

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use secure MongoDB connection string
- [ ] Set strong session and JWT secrets
- [ ] Configure CORS for your domain
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure proper logging
- [ ] Set up monitoring and health checks
- [ ] Configure backup strategy for database

## 🔒 Security Features

- **Password Security**: bcrypt for secure password hashing
- **Input Validation**: express-validator for comprehensive API validation
- **Session Management**: Secure session handling with MongoDB store
- **JWT Authentication**: Stateless token-based authentication
- **CORS Protection**: Configurable CORS settings for API security
- **Environment Variables**: Sensitive data stored securely in .env files
- **Database Security**: Mongoose schema validation and sanitization

## 🐛 Troubleshooting

### Common Issues and Solutions

#### MongoDB Connection Issues
```bash
# Error: MongoNetworkError
# Solution: Check if MongoDB is running
npm run check-connection

# Error: IP not whitelisted (MongoDB Atlas)
# Solution: Add your IP to MongoDB Atlas whitelist
```

#### Port Already in Use
```bash
# Error: EADDRINUSE: address already in use :::3000
# Solution: Change port in .env or kill existing process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

#### Seed Script Issues
```bash
# Error: Cannot connect to database
# Solution: Ensure MongoDB is running and connection string is correct
npm run check-connection

# Error: Seed data already exists
# Solution: Clear database first (be careful in production!)
# Use the clearDatabase function in database.js
```

#### Frontend Issues
```bash
# Error: Products not loading
# Solution: Check browser console and network tab
# Verify API endpoints are accessible

# Error: Login/Authentication not working
# Solution: Check JWT secret and session configuration
# Verify user credentials in database
```

#### Development Issues
```bash
# Error: Module not found
# Solution: Install missing dependencies
npm install

# Error: Permission denied
# Solution: Check file permissions
chmod +x script-name.js  # Make script executable
```

### Getting Help
1. Check the [Issues](https://github.com/yourusername/ecommerce-store/issues) page
2. Search existing issues before creating new ones
3. Provide detailed error messages and steps to reproduce
4. Include your environment information (OS, Node.js version, etc.)

## 📊 Performance Optimization

### Database Performance
- Use MongoDB indexes for frequently queried fields
- Implement pagination for large data sets
- Use aggregation pipelines for complex queries
- Consider MongoDB connection pooling

### Frontend Performance
- Implement lazy loading for images
- Use CSS and JavaScript minification
- Implement caching strategies
- Optimize images and assets

### Server Performance
- Use compression middleware
- Implement rate limiting
- Use caching for static assets
- Monitor memory usage and performance metrics

## 🧪 Testing

### Manual Testing
1. User registration and login
2. Product browsing and searching
3. Cart operations (add, remove, update)
4. Checkout process
5. Order management
6. User profile management

### Automated Testing (Future Implementation)
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔄 Version History

### v1.0.0
- Initial release with core e-commerce features
- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart functionality
- Order processing and management
- Responsive design implementation

### Planned Features
- [ ] Admin dashboard for product management
- [ ] Email notifications for orders
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Social media integration
- [ ] Multi-language support

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: express-validator for API validation
- **Session Management**: Secure session handling
- **JWT Authentication**: Token-based authentication
- **CORS Protection**: Configurable CORS settings

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process on port 3000

3. **Seed Script Fails**
   - Ensure MongoDB is running
   - Check database permissions

4. **Products Not Loading**
   - Check browser console for errors
   - Verify API endpoints are accessible

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions to improve this e-commerce store! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-store.git
   cd ecommerce-store
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow the existing code style
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m 'Add some amazing feature'
   ```

5. **Push to Your Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of your changes
   - Include screenshots if UI changes are involved
   - Reference any related issues

### Development Guidelines

- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Comment complex logic
- Ensure responsive design compatibility
- Test on multiple browsers and devices

### Code Style

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings
- Keep lines under 80 characters when possible

### Reporting Issues

If you find bugs or have feature requests:
1. Check existing issues first
2. Create a new issue with detailed description
3. Include steps to reproduce (for bugs)
4. Add screenshots if applicable

### Types of Contributions Welcome

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🔧 Code refactoring
- 🧪 Test coverage improvements

## � License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability assumed

## �📞 Support & Contact

### Getting Help
- 📖 Check the documentation first
- 🔍 Search existing [Issues](https://github.com/yourusername/ecommerce-store/issues)
- 💬 Join our community discussions
- 📧 Contact the maintainers

### Community
- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and community support
- **Email**: your-email@example.com (for private inquiries)

### Maintainers
- **Your Name** - Initial work and maintenance
- **Contributors** - See [Contributors](https://github.com/yourusername/ecommerce-store/contributors)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- MongoDB for the excellent database platform
- Express.js team for the robust web framework
- Node.js community for the amazing ecosystem
- All the open-source libraries that make this project possible

## 📚 Additional Resources

### Learning Resources
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JavaScript ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Similar Projects
- [E-commerce boilerplates](https://github.com/topics/ecommerce)
- [Node.js shopping cart examples](https://github.com/topics/shopping-cart)
- [Express.js project templates](https://github.com/topics/express-template)

---

**⭐ If you found this project helpful, please give it a star!**

**Built with ❤️ using Express.js, MongoDB, and vanilla JavaScript**

*Last updated: July 2025*
