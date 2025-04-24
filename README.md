# Newave Store E-commerce API

A complete e-commerce backend API built with Node.js, Express, MongoDB, and JWT authentication. This project provides endpoints for managing categories, services/products, and user authentication.

## Features

- User authentication with JWT
- Role-based access control (user/admin)
- Category management
- Service/Product management
- MongoDB integration
- Ready for Vercel deployment

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git (for version control)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/newave-store.git
   cd newave-store
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

## Running Locally

```
npm run dev
```

The server will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get token
- `GET /api/users/me` - Get current user profile (requires authentication)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

### Services/Products
- `GET /api/services` - Get all services
- `GET /api/services/category/:categoryId` - Get services by category
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create a new service (admin only)
- `PUT /api/services/:id` - Update a service (admin only)
- `DELETE /api/services/:id` - Delete a service (admin only)

## Deployment to Vercel

1. Create a Vercel account and install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Set up environment variables in the Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key

## GitHub Integration

1. Create a new GitHub repository
2. Push your code to GitHub:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/newave-store.git
   git push -u origin main
   ```

3. Connect your Vercel project to the GitHub repository for automatic deployments

## Accessing the Application

Once deployed, your API will be accessible at:
- https://newave-store.vercel.app/

You can also access it locally at:
- http://localhost:3000

## License

MIT