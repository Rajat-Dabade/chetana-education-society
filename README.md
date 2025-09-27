# Chetana Education Society Website

A production-ready educational NGO website with admin portal built with React, Node.js, and TypeScript. Features dynamic content management, responsive design, dark mode support, and professional design focused on education and community development.

## 🌟 Features

### Public Website
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: System preference detection with manual toggle
- **SEO Optimized**: Meta tags, OpenGraph, and semantic HTML
- **Accessibility**: WCAG AA+ compliance with focus management
- **Performance**: Optimized images, lazy loading, and efficient caching

### Admin Portal
- **Authentication**: JWT-based secure login system
- **Content Management**: Full CRUD operations for all dynamic content
- **Media Library**: Image upload and management system
- **Rich Text Editor**: TipTap integration for blog posts and news
- **Drag & Drop**: Reorderable blog posts with custom priority
- **Real-time Updates**: React Query for efficient data synchronization

### Content Types
- **Testimonials**: Community feedback with 5-star ratings
- **Success Stories**: Impact narratives with rich content
- **Milestones**: Organizational achievements timeline (chronologically ordered)
- **News & Events**: Filterable and searchable updates
- **Blog Posts**: Author-attributed articles with drag-to-reorder
- **Media Assets**: Organized file management system

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Tailwind CSS** for styling with custom design system
- **React Router v6** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Lucide Icons** for consistent iconography

### Backend
- **Node.js** with Express and TypeScript
- **Prisma ORM** with SQLite (dev) / PostgreSQL (prod)
- **JWT Authentication** with bcrypt password hashing
- **Multer** for file uploads with validation
- **Zod** for request validation and type safety
- **CORS** configured for development

### Development Tools
- **ESLint** and **Prettier** for code quality
- **Concurrently** for running multiple processes
- **Nodemon** for backend development
- **TypeScript** for type safety across the stack

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NGO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Backend (`apps/api/.env`):
   ```bash
   cp apps/api/env.example apps/api/.env
   ```
   
   Frontend (`apps/web/.env`):
   ```bash
   cp apps/web/env.example apps/web/.env
   ```

4. **Initialize the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:5173 (or 5174 if 5173 is in use)
- **Backend**: http://localhost:4000

### Admin Access
- **URL**: http://localhost:5173/admin/login (or 5174 if port changed)
- **Email**: admin@ngo.org
- **Password**: ChangeMe123!

## 📁 Project Structure

```
NGO/
├── apps/
│   ├── api/                    # Backend application
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   ├── src/
│   │   │   ├── lib/            # Utilities and configurations
│   │   │   ├── routes/         # API route handlers
│   │   │   ├── index.ts        # Express server setup
│   │   │   └── seed.ts         # Database seeding script
│   │   └── uploads/            # File upload directory
│   │
│   └── web/                    # Frontend application
│       ├── public/             # Static assets
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utilities and API client
│       │   ├── pages/          # Route components
│       │   │   ├── admin/      # Admin portal pages
│       │   │   └── ...         # Public pages
│       │   └── main.tsx        # Application entry point
│       └── index.html          # HTML template
│
├── package.json                # Root package configuration
└── README.md                   # This file
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #0038B8 (Israel flag inspired)
- **Navy Variants**: For dark mode and depth
- **Semantic Colors**: Success, warning, error states
- **Neutral Grays**: Text and background variations

### Typography
- **Font Stack**: System fonts for performance
- **Scale**: Consistent sizing with Tailwind classes
- **Weights**: Regular, medium, semibold, bold

### Components
- **Cards**: Elevated surfaces with hover effects
- **Buttons**: Primary, secondary, outline, ghost variants
- **Forms**: Consistent styling with validation states
- **Navigation**: Responsive with mobile-first approach

## 🔧 Configuration

### Environment Variables

#### Backend (`apps/api/.env`)
```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
MAX_FILE_SIZE=5242880
UPLOAD_PATH="uploads"
```

#### Frontend (`apps/web/.env`)
```bash
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME="Hope for Tomorrow NGO"
VITE_APP_URL=http://localhost:5173
```

### Database Configuration

The application uses SQLite for development and can be easily switched to PostgreSQL for production by updating the `DATABASE_URL` environment variable:

```bash
# PostgreSQL example
DATABASE_URL="postgresql://username:password@localhost:5432/ngo_db"
```

## 📝 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run lint` - Run ESLint on both applications
- `npm run format` - Format code with Prettier
- `npm run seed` - Seed the database with sample data

### Backend (`apps/api`)
- `npm run dev` - Start backend development server
- `npm run build` - Build backend for production
- `npm run start` - Start production backend server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Frontend (`apps/web`)
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally

## 🗄️ Database Schema

### Core Models
- **AdminUser**: Authentication and user management
- **SiteSetting**: Global site configuration
- **Media**: File upload tracking

### Content Models
- **Testimonial**: Community feedback
- **SuccessStory**: Impact narratives with rich content
- **Milestone**: Organizational achievements
- **NewsItem**: News articles and events
- **BlogPost**: Author-attributed blog content

### Key Features
- **Slugs**: SEO-friendly URLs for all public content
- **Timestamps**: Created and updated tracking
- **Rich Content**: HTML content with sanitization
- **Media Relations**: Flexible file associations

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiration**: 7-day expiry with refresh capability

### Data Protection
- **Input Validation**: Zod schemas on both client and server
- **HTML Sanitization**: DOMPurify for user-generated content
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Environment-specific origins

### File Upload Security
- **File Type Validation**: Image-only restrictions
- **Size Limits**: Configurable maximum file sizes
- **Unique Naming**: Timestamp-based file naming
- **Path Sanitization**: Secure file storage

## 🌐 Deployment

### Production Build
```bash
# Build both applications
npm run build

# Backend will be in apps/api/dist/
# Frontend will be in apps/web/dist/
```

### Environment Setup
1. Set production environment variables
2. Configure PostgreSQL database
3. Set up file storage (local or cloud)
4. Configure reverse proxy (nginx recommended)
5. Set up SSL certificates

### Recommended Deployment Stack
- **Hosting**: VPS or cloud provider (DigitalOcean, AWS, etc.)
- **Database**: PostgreSQL with automated backups
- **Web Server**: Nginx as reverse proxy
- **SSL**: Let's Encrypt certificates
- **Monitoring**: PM2 for Node.js process management

## 🧪 Testing

### Manual Testing Checklist
- [ ] All public pages load correctly
- [ ] Dark mode toggle works across all pages
- [ ] Admin login and authentication flow
- [ ] CRUD operations for all content types
- [ ] File upload functionality
- [ ] Responsive design on mobile devices
- [ ] SEO meta tags and OpenGraph data
- [ ] Accessibility with keyboard navigation

### Performance Testing
- Run Lighthouse audits on sample pages
- Target scores: Performance >90, Accessibility >95, Best Practices >90, SEO >95

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes with appropriate tests
4. Run linting and formatting
5. Submit a pull request with detailed description

### Code Standards
- Follow existing TypeScript and React patterns
- Use semantic commit messages
- Maintain accessibility standards
- Add JSDoc comments for complex functions
- Update documentation for new features

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/change-password` - Update admin password

### Content Endpoints
- `GET /api/impact/testimonials` - List testimonials
- `GET /api/impact/stories` - List success stories
- `GET /api/impact/stories/:slug` - Get story by slug
- `GET /api/impact/milestones` - List milestones
- `GET /api/news` - List news/events with filtering
- `GET /api/news/:slug` - Get news item by slug
- `GET /api/blogs` - List blog posts
- `GET /api/blogs/:slug` - Get blog post by slug

### Admin Endpoints (Protected)
All admin endpoints require `Authorization: Bearer <token>` header
- `POST /api/impact/*` - Create content
- `PUT /api/impact/*/:id` - Update content
- `DELETE /api/impact/*/:id` - Delete content
- `POST /api/upload` - Upload media files
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update site settings

## 🐛 Troubleshooting

### Common Issues

**Database connection errors**
- Verify DATABASE_URL is correct
- Run `npm run prisma:generate` after schema changes
- Check database permissions and connectivity

**File upload failures**
- Verify upload directory permissions
- Check MAX_FILE_SIZE environment variable
- Ensure CORS is configured for your domain

**Authentication issues**
- Verify JWT_SECRET is set and consistent
- Check token expiration and refresh logic
- Confirm CORS headers for authentication requests

**Build errors**
- Clear node_modules and reinstall dependencies
- Check TypeScript configuration and imports
- Verify all environment variables are set

### Getting Help
- Check the GitHub issues for similar problems
- Review the console logs for detailed error messages
- Ensure all dependencies are up to date
- Verify environment variable configuration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Prisma Team** for the fantastic ORM
- **Lucide** for the beautiful icon library
- **Community Contributors** who helped improve this project

---

Built with ❤️ for making a positive impact in communities worldwide.
