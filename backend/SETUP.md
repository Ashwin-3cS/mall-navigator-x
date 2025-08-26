# 🚀 Quick Setup Guide

## ⚡ Get Started in 5 Minutes

### 1. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env with your MongoDB URI
nano .env
```

**Required Environment Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mall_navigation
PORT=3000
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Test Database Connection
```bash
node test-connection.js
```

### 4. Seed Database (First Time Only)
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Test API Endpoints
```bash
node test-api.js
```

## 🔗 Quick Test Commands

### Health Check
```bash
curl http://localhost:3000/health
```

### QR Code Validation
```bash
curl -X POST http://localhost:3000/api/locations/validate \
  -H "Content-Type: application/json" \
  -d '{"qr_id": "1E01"}'
```

### Store Directory
```bash
curl "http://localhost:3000/api/stores?floor=1&category=Food"
```

### Route Calculation
```bash
curl -X POST http://localhost:3000/api/navigation/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "start_location": "1E01",
    "destination": "2FC01"
  }'
```

## 📊 What's Included

✅ **Complete Backend API** with Express.js and TypeScript  
✅ **MongoDB Integration** with Mongoose ODM  
✅ **42 QR Code Locations** across 2 floors  
✅ **20 Sample Stores** in various categories  
✅ **Navigation Engine** with route calculation  
✅ **Security Features** (rate limiting, CORS, validation)  
✅ **Comprehensive Testing** scripts  
✅ **Production Ready** deployment configuration  

## 🎯 Sample Data Overview

- **Floor 1**: Main entrance, shops, intersections, escalator
- **Floor 2**: Food court, entertainment, escalator landing
- **QR Codes**: Strategic placement for navigation
- **Stores**: Fashion, Food, Electronics, Sports, etc.
- **Routes**: Multi-floor navigation with escalators

## 🚨 Troubleshooting

### MongoDB Connection Issues
```bash
# Test connection
node test-connection.js

# Check .env file
cat .env | grep MONGODB_URI
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or change port in .env
echo "PORT=3001" >> .env
```

### TypeScript Errors
```bash
# Clean build
rm -rf dist/
npm run build
```

## 🌐 API Documentation

- **Base URL**: `http://localhost:3000`
- **Health Check**: `GET /health`
- **API Base**: `GET /api/*`
- **Swagger**: Coming soon

## 📱 Frontend Integration

The backend is ready for frontend integration:
- CORS configured for localhost:3000 and localhost:5173
- JSON API responses
- Error handling with proper HTTP status codes
- Rate limiting for production use

---

**🎉 Your Mall Navigation Backend is Ready! 🎉**

Start the server with `npm run dev` and test with `node test-api.js` 