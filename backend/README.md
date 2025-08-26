# Mall Navigation Backend API

A robust backend API for the QR Code Mall Navigation System, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **QR Code Validation** - Validate QR codes and get location information
- **Store Directory** - Comprehensive store management with filtering and search
- **Navigation Engine** - Route calculation between any two mall locations
- **Multi-floor Support** - Navigate between floors using escalators
- **Emergency Routing** - Find nearest exits for safety
- **RESTful API** - Clean, documented endpoints
- **Security** - Rate limiting, CORS, and input validation
- **Scalable** - MongoDB with proper indexing

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon, TypeScript compiler

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Edit `.env` with your MongoDB connection string:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mall_navigation

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration
SESSION_EXPIRY_HOURS=2
```

### 3. Database Setup

Seed the database with sample mall data:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📊 Database Schema

### Locations Collection
- **QR Code Management** - Unique QR IDs for each mall location
- **Coordinate System** - 10x10 grid per floor (5m per unit)
- **Location Types** - Entrance, Shop, Intersection, Vertical Transport, Amenity
- **Connected Nodes** - Navigation graph connections

### Stores Collection
- **Store Information** - Name, category, floor, coordinates
- **Operating Hours** - Daily schedules
- **Promotions** - Active deals and offers
- **QR Integration** - Associated location QR codes

### Navigation Graph Collection
- **Path Connections** - Between any two locations
- **Distance & Time** - Walking distances and estimated times
- **Instructions** - Human-readable navigation steps
- **Accessibility** - Wheelchair-friendly routes

## 🔗 API Endpoints

### Health Check
```
GET /health
```

### QR Code Validation
```
POST /api/locations/validate
Body: { "qr_id": "1E01" }
```

### Store Directory
```
GET /api/stores?floor=1&category=Fashion
GET /api/stores/category/Food
GET /api/stores/floor/2
GET /api/stores/search/coffee
```

### Navigation
```
POST /api/navigation/calculate
Body: {
  "start_location": "1E01",
  "destination": "2FC01"
}

GET /api/navigation/emergency/nearest-exit?location=1I01
```

### Locations
```
GET /api/locations?floor=1&type=entrance
GET /api/locations/1E01
GET /api/locations/1E01/nearby?distance=50
```

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. QR Validation
```bash
curl -X POST http://localhost:3000/api/locations/validate \
  -H "Content-Type: application/json" \
  -d '{"qr_id": "1E01"}'
```

### 3. Store Directory
```bash
curl "http://localhost:3000/api/stores?floor=1&category=Food"
```

### 4. Route Calculation
```bash
curl -X POST http://localhost:3000/api/navigation/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "start_location": "1E01",
    "destination": "2FC01"
  }'
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/          # MongoDB schemas
│   │   ├── Location.ts
│   │   ├── Store.ts
│   │   └── NavigationGraph.ts
│   ├── routes/          # API endpoints
│   │   ├── locations.ts
│   │   ├── stores.ts
│   │   └── navigation.ts
│   ├── services/        # Business logic
│   │   ├── locationService.ts
│   │   ├── storeService.ts
│   │   └── navigationService.ts
│   ├── utils/           # Helper functions
│   │   └── database.ts
│   └── app.ts           # Main application
├── data/                # Seed data
│   └── seedData.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Sample Data

The seed script creates:

- **42 QR Code Locations** across 2 floors
- **20 Stores** in various categories
- **Navigation Graph** with 50+ connections
- **Multi-floor Routes** using escalators

### Sample QR Codes
- `1E01` - Main Entrance - South (Floor 1)
- `1I02` - Central Plaza (Floor 1)
- `1V01` - Main Escalator (Floor 1)
- `2E01` - Floor 2 Escalator Landing
- `2FC01` - Food Court (Floor 2)

## 🔧 Development Commands

```bash
# Development mode with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Seed database with sample data
npm run seed
```

## 🚀 Deployment

### Railway (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `npm run build`
4. Set start command: `npm start`

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
PORT=3000
```

## 📈 Performance & Scaling

- **Response Time**: < 2 seconds for route calculation
- **Concurrent Users**: Supports 500+ simultaneous users
- **Database**: MongoDB Atlas with auto-scaling
- **Caching**: In-memory caching for MVP (Redis ready)

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origins
- **Input Validation**: All inputs sanitized
- **Helmet Security**: HTTP security headers
- **Error Handling**: No sensitive data in error messages

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI in .env
   - Verify network connectivity
   - Check MongoDB Atlas IP whitelist

2. **Port Already in Use**
   - Change PORT in .env
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **TypeScript Compilation Errors**
   - Run `npm run build` to see detailed errors
   - Check tsconfig.json configuration

4. **Database Seeding Failed**
   - Ensure MongoDB is running
   - Check connection string
   - Verify database permissions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Create GitHub issue with details

---

**Ready to power seamless mall navigation! 🛍️✨** 