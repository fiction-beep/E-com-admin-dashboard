# E-commerce Admin Dashboard

A modern, responsive admin dashboard built with Vue 3, TypeScript, and Tailwind CSS. This dashboard provides comprehensive tools for managing an e-commerce platform, including product management, order tracking, and analytics.

## Features

- 📊 Interactive analytics and charts
- 📦 Product management with image upload
- 📝 Order tracking and management
- 🔍 Advanced data tables with AG Grid
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure authentication system
- 📱 Fully responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
```

5. For production build:
```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run server` - Start backend server

## Project Structure

```
ecommerce-admin-dashboard/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # Vue components
│   ├── views/         # Page components
│   ├── router/        # Vue Router configuration
│   ├── stores/        # Pinia stores
│   └── types/         # TypeScript type definitions
├── server/            # Backend server code
└── public/            # Public static files
```

## Navigation Guide

1. **Dashboard Overview**
   - Access key metrics and analytics
   - View recent orders and sales data
   - Monitor system status

2. **Products**
   - Manage product catalog
   - Add/Edit product details
   - Upload product images
   - Set pricing and inventory

3. **Orders**
   - View all orders
   - Track order status
   - Process refunds
   - Generate invoices

4. **Analytics**
   - Sales reports
   - Customer insights
   - Revenue tracking
   - Performance metrics

## Dependencies

### Core Dependencies
- Vue 3
- TypeScript
- Tailwind CSS
- Pinia (State Management)
- Vue Router
- AG Grid
- Chart.js

### Development Dependencies
- Vite
- ESLint
- Prettier
- TypeScript
- Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
