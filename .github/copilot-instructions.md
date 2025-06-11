# Copilot Instructions for Hotel Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React.js hotel management system built with Vite, JavaScript, and CSS Modules. The application is a responsive Single Page Application (SPA) that connects to an ASP.NET Core Web API.

## Code Style Guidelines
- Use functional components with React hooks
- Use CSS Modules for styling (`.module.css` files)
- Follow camelCase for JavaScript variables and functions
- Use PascalCase for React component names
- Use kebab-case for CSS class names
- Implement proper error handling and loading states
- Use React Router for navigation
- Implement JWT authentication with localStorage
- Use axios for API calls with interceptors

## Architecture Patterns
- Feature-based folder structure
- Reusable UI components in `/components` folder
- Custom hooks for business logic
- Context API for global state management
- Form validation using react-hook-form with yup schemas

## API Integration
- Base URL: `/api/`
- JWT token authentication
- Automatic token refresh and 401 handling
- All API endpoints follow REST conventions

## Key Features to Implement
- Dashboard with charts and statistics
- User and role management
- Customer management
- Room and room type management
- Booking system with wizard interface
- Service management
- Invoice and payment tracking
- Inventory management
- Reporting with date filters
- Responsive design for mobile and desktop
