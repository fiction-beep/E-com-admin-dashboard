# E-commerce Admin Dashboard

A modern, responsive admin dashboard for e-commerce businesses built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- **Revenue Analysis**
  - Real-time metrics for total orders and sales
  - Interactive charts for revenue trends
  - Category-wise performance analysis
  - Historical data visualization

- **Inventory Management**
  - Complete product listing with advanced filtering
  - Stock level monitoring
  - Low stock alerts
  - Bulk export functionality
  - Real-time stock updates

- **Product Registration**
  - User-friendly product addition form
  - Image upload support
  - Form validation
  - Category management
  - Success notifications

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Tailwind CSS
- Chart.js for data visualization
- AG Grid for data tables
- Pinia for state management
- Vue Router for navigation
- Vite for build tooling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecommerce-admin-dashboard.git
   cd ecommerce-admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
ecommerce-admin-dashboard/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable Vue components
│   ├── pages/          # Page components
│   ├── router/         # Vue Router configuration
│   ├── store/          # Pinia store
│   ├── utils/          # Utility functions
│   └── App.vue         # Root component
├── public/             # Public assets
└── ...config files
```

## Features Overview

### Revenue Analysis Page
- View total orders and revenue metrics
- Interactive charts showing trends
- Filter data by time period
- Category-wise revenue breakdown

### Inventory Management Page
- Complete product listing with sorting and filtering
- Stock level indicators
- Low stock alerts
- Export functionality
- Quick stock updates

### Product Registration Page
- Add new products with detailed information
- Image upload support
- Form validation
- Success notifications
- Automatic inventory updates

## Development

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Lint files
npm run lint

# Format files
npm run format
```

### Type Checking

```bash
# Run type checking
vue-tsc --noEmit
```

## Deployment

The application can be deployed to any static hosting service:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
