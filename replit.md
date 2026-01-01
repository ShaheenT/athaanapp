# Replit.md - Athaan Fi Beit System

## Overview

Athaan Fi Beit is an Islamic Prayer Time Management System that delivers automated prayer calls (Athaan) through IoT devices. The system features a full-stack web application with an admin dashboard for managing prayer times, devices, users, and audio profiles. The architecture follows a modern monorepo structure with React frontend and Express.js backend, integrated with PostgreSQL database using Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom Islamic theme colors
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware

### Database Architecture
- **Database**: MongoDB (migrated from PostgreSQL)
- **ODM**: Mongoose with schema validation
- **Schema Management**: Mongoose models with Zod validation
- **Connection**: Direct MongoDB connection with connection pooling

## Key Components

### Authentication System
- Replit Auth integration with OIDC
- Session-based authentication with PostgreSQL store
- User profile management with automatic user creation
- Protected routes requiring authentication

### Core Entities
1. **Users**: Basic user information and authentication
2. **Customer Profiles**: Extended user profiles with membership details
3. **Devices**: IoT device management with status tracking
4. **Prayer Times**: Daily prayer schedules with multiple sources
5. **Audio Profiles**: Athaan audio file management
6. **Technicians**: Service personnel management
7. **Activity Logs**: System event tracking

### Admin Dashboard Features
- Real-time statistics and metrics
- Device status monitoring and control
- Prayer times management with upload functionality
- User and customer profile management
- Audio profile configuration
- Recent activity tracking

## Data Flow

### Authentication Flow
1. User accesses protected route
2. Replit Auth middleware validates session
3. User information retrieved from database
4. Access granted or redirect to login

### Device Management Flow
1. Admin monitors device status through dashboard
2. Real-time updates via database queries
3. Device simulation capabilities for testing
4. Activity logging for all device interactions

### Prayer Times Flow
1. Prayer times uploaded via CSV or API integration
2. Stored in database with source tracking
3. Displayed in dashboard with formatted times
4. Devices retrieve current prayer times for Athaan delivery

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **date-fns**: Date manipulation utilities

### Authentication Dependencies
- **openid-client**: OIDC authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Production bundling

## Deployment Strategy

### Environment Configuration
- **Development**: Uses Vite dev server with hot reload
- **Production**: Builds static assets and serves via Express
- **Database**: Requires MONGODB_URI environment variable
- **Sessions**: Requires SESSION_SECRET for security

### Build Process
1. Frontend assets built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static file serving configured for production
4. Database migrations applied via Drizzle Kit

### Replit Integration
- Configured for Node.js 20 with PostgreSQL 16
- Auto-scaling deployment target
- Development banner integration
- Cartographer plugin for enhanced debugging

## Recent Changes

- June 27, 2025: **CRITICAL: APPLICATION MUST BE TESTED TODAY**
  - Created SSH-based Raspberry Pi setup guide for remote installation
  - Built stable demo system bypassing MongoDB dependencies for immediate testing
  - Added WebSocket communication for real-time device control
  - Created comprehensive testing flow: Admin Dashboard → Raspberry Pi → iPhone PWA
  - User requirement: Complete end-to-end testing with Bluetooth speaker on Pi 5
  - System must support: Prayer triggers, volume control, mute/unmute, real-time sync

- June 27, 2025: **MARKETING AND REGISTRATION SYSTEM COMPLETED**
  - Created comprehensive marketing landing page with pricing plans
  - Built complete user registration and payment flow with PayFast integration
  - Added unique membership ID generation system linking users to devices
  - Integrated automatic email confirmations and customer notifications
  - Fixed demo dashboard routing with working navigation to all admin pages
  - Added demo data API endpoints for testing without authentication
  - Created complete deployment documentation covering all environments
  - Added MacBook M2/M3 and Intel setup instructions
  - Built CI/CD pipeline configuration for GitHub Actions

- June 26, 2025: **COMPLETED MONGODB MIGRATION** - Fully migrated from PostgreSQL to MongoDB
- June 25, 2025: Redesigned admin dashboard with vertical sidebar and widget-based home page
- Enhanced Users page with account enable/disable controls and payment notification system
- Updated Devices page to show device ID, user assignments, location, and online/offline/maintenance status
- Added comprehensive customer profile management with detailed modals
- Implemented backend routes for customer account management and notifications
- Updated database schema with account status, payment status, and notification preferences
- Created demo dashboard accessible at `/demo` for immediate preview without authentication
- Built complete Customer PWA with trendy login design and forgot password functionality
- Developed EiX-piware: Complete Raspberry Pi device software for automated prayer calls
- Implemented auto WiFi detection, system monitoring, audio management, and dashboard integration
- Created web-based setup interface for technicians with minimal configuration required
- Added push notification system with prayer alerts and payment reminders
- Integrated PayFast payment processing for South African market (R299 monthly subscriptions)
- Implemented Aladhan API for real-time prayer time calculation across 5 South African cities
- Built complete multilingual support with English and Arabic translations using i18next
- Added automated daily prayer time calculation with scheduled background updates
- Created prayer time calculator interface for admin bulk calculations
- Implemented complete WebSocket-based device communication system
- Built real-time device control panel with command acknowledgment
- Verified end-to-end integration between admin dashboard, Pi devices, and customer PWA
- Added device status monitoring with live connection tracking
- Created all admin dashboard pages: Users, Devices, Prayer Times, Audio Profiles, Technicians, System Settings
- Implemented functional logout button and proper authentication flow
- Verified complete system functionality across all components
- Created comprehensive README.md with local development setup instructions for MacBook
- Fixed all routing issues and confirmed all admin dashboard pages are accessible
- Created professional admin login form with username/password fields and forgot password functionality
- Added CSV upload functionality for prayer times management
- Implemented audio file upload system for call to prayer audio management
- Created dedicated technician portal with separate authentication system
- Fixed all widget navigation to redirect to correct admin pages
- Verified complete end-to-end system functionality - ready for download as zip file
- Migrated entire system from PostgreSQL/Drizzle to MongoDB/Mongoose architecture
- Removed all PostgreSQL dependencies and files while preserving functionality
- Updated environment configuration to use MONGODB_URI connection string
- Configured MongoDB session storage for authentication system

## Changelog

- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.