# QR Code Mall Navigation System - Backend Project Brief

## 🎯 **Project Overview**

A **web-based indoor navigation system** for shopping malls using QR codes for location identification. Users scan QR codes placed throughout the mall to get real-time step-by-step directions to their desired destinations - **no app installation required, no user authentication needed**.

---

## 🏗️ **System Architecture**

### **High-Level Flow:**
```
User scans QR → Web App opens → User selects destination → Backend calculates route → 
User follows steps → Scans checkpoint QRs → Gets updated directions → Reaches destination
```

### **Core Components:**
1. **QR Code Infrastructure** - Static codes placed at key mall locations
2. **Web-based Frontend** - Progressive Web App (no download needed)
3. **Backend API** - Route calculation and mall data management
4. **Database** - Mall layout, stores, and navigation graph

---

## 🏢 **Mall Layout Specifications**

### **Physical Structure:**
- **2 floors** with **10 shops per floor** = **20 total stores**
- **Grid-based coordinate system** (10x10 per floor)
- **QR codes placed at ~25-30 strategic locations**

### **QR Code Placement Strategy:**
```
📍 Main entrances (4 codes)
🏪 Each shop entrance (20 codes)  
🔄 Elevators/escalators (6 codes)
🛣️ Major intersections (8 codes)
🚻 Amenities (restrooms, info desk) (4 codes)

Total: ~42 QR codes throughout mall
```

### **QR Code ID Format:**
```
Format: [Floor][Type][Number]
Examples:
- 1E01 = Floor 1, Entrance 1
- 2S05 = Floor 2, Shop 5
- 1I03 = Floor 1, Intersection 3
- 2V01 = Floor 2, Vertical transport (elevator)
```

---

## 🔄 **Complete User Journey Flow (Technical Implementation)**

### **Step 1: Entry & QR Scan**
```
User enters mall → Sees QR code → Scans with phone camera → 
URL opens: https://mallnav.com/nav?loc=1E01&start=true

Backend Processing:
1. Frontend detects ?loc=1E01 parameter
2. Calls POST /api/locations/validate {"qr_id": "1E01"}  
3. Backend validates QR and returns location data
4. Response: Location name, floor, coordinates, nearby landmarks
```

### **Step 2: Location Confirmation**
```
Web app detects QR parameter → Backend validates location → 
Shows: "You are at: Main Entrance - Floor 1"

API Response Example:
{
  "success": true,
  "location": {
    "qr_id": "1E01",
    "name": "Main Entrance - South",
    "floor": 1,
    "coordinates": {"x": 5, "y": 0},
    "nearby_landmarks": ["Information Desk", "ATM"]
  }
}
```

### **Step 3: Destination Selection**
```
User browses store directory → Selects "Food Court (Floor 2)" →
Backend calculates optimal route → Returns step-by-step directions

Backend Processing:
1. GET /api/stores?floor=2&category=food returns available options
2. User selects Food Court (store_id: "2FC01")  
3. POST /api/navigation/calculate with start + destination
4. A* algorithm calculates optimal path with checkpoints
5. Returns structured step-by-step instructions
```

### **Step 4: Navigation Guidance**
```
User sees: "Step 1: Walk straight 25m to Information Desk"
User follows direction → Reaches Information Desk

API Response Structure:
{
  "route": {
    "session_id": "nav_abc123",
    "total_distance": "75m",
    "estimated_time": "2 minutes",
    "current_step": 1,
    "steps": [
      {
        "step_number": 1,
        "instruction": "Walk straight 25 meters",
        "landmark": "Pass Information Desk on right", 
        "checkpoint_qr": "1I01",
        "distance": 25,
        "direction": "straight"
      }
    ]
  }
}
```

### **Step 5: Checkpoint Scanning**
```
User scans QR at Information Desk → Backend detects checkpoint completion →
Auto-advances to: "Step 2: Turn left toward escalator"

Backend Processing:
1. User scans QR "1I01" at Information Desk
2. POST /api/navigation/checkpoint {"session_id": "nav_abc123", "scanned_qr": "1I01"}
3. Backend validates checkpoint matches expected location
4. Updates session: completed_steps += "1I01", current_step = 2
5. Recalculates remaining route from confirmed location
6. Returns next step instructions automatically
```

### **Step 6: Route Progression**
```
Process repeats for each checkpoint:
Checkpoint 2 (Escalator) → Step 3 directions
Checkpoint 3 (Floor 2) → Step 4 directions  
Final destination reached → "You've arrived!"

Checkpoint Flow for Each QR Scan:
1. Validate scanned QR matches expected checkpoint
2. Mark current step as completed ✅
3. Recalculate route from new confirmed location
4. Generate next step instruction
5. Update session state in memory
6. Return progress update to frontend

Final Response:
{
  "success": true,
  "arrived": true,
  "message": "You've reached Food Court!",
  "total_steps_completed": 6,
  "final_location": "2FC01"
}
```

---

## 🛠️ **Backend Technical Stack**

### **Initial MVP Stack (No Redis):**
```
Runtime: Node.js 18+
Framework: Express.js
Database: MongoDB (MongoDB Atlas for cloud)
Hosting: Railway / Render / Vercel (budget-friendly)
Authentication: None required (public access)
Caching: In-memory caching for MVP
```

### **Why No Redis for MVP:**
- **Simpler deployment** - One less service to manage
- **Cost-effective** - No additional service costs
- **Faster development** - Use in-memory caching
- **Easy scaling later** - Can add Redis when traffic increases

---

## 📊 **Database Schema Design**

### **1. Locations Collection:**
```javascript
{
  _id: ObjectId,
  qr_id: "1E01",
  floor: 1,
  name: "Main Entrance - South",
  type: "entrance", // entrance, shop, intersection, vertical, amenity
  coordinates: { x: 5, y: 0 },
  nearby_landmarks: ["Information Desk", "ATM"],
  connected_nodes: ["1I01", "1I02"], // For routing graph
  created_at: Date,
  is_active: true
}
```

### **2. Stores Collection:**
```javascript
{
  _id: ObjectId,
  store_id: "2S05",
  name: "McDonald's",
  floor: 2,
  category: "Food",
  location: { x: 7, y: 8 },
  operating_hours: {
    monday: "8:00-22:00",
    tuesday: "8:00-22:00",
    // ... other days
  },
  contact: "123-456-7890",
  description: "Fast food restaurant",
  promotions: [
    {
      title: "Buy 1 Get 1 Free",
      valid_until: Date,
      is_active: true
    }
  ],
  qr_location: "2S05", // Associated QR code
  created_at: Date,
  is_active: true
}
```

### **3. Navigation Graph Collection:**
```javascript
{
  _id: ObjectId,
  from_node: "1E01",
  to_node: "1I01", 
  distance: 25, // meters
  direction: "straight",
  instructions: "Walk straight toward Information Desk",
  landmarks: ["Information Desk on your right"],
  is_accessible: true, // wheelchair accessible
  floor_change: false,
  estimated_time: 18, // seconds
  created_at: Date
}
```

### **4. User Sessions Collection (Optional):**
```javascript
{
  _id: ObjectId,
  session_id: "abc123",
  current_location: "1E01",
  destination: "2FC01",
  route_steps: [...],
  current_step: 2,
  completed_steps: ["1E01", "1I01"],
  started_at: Date,
  last_activity: Date,
  expires_at: Date // Auto-expire after 2 hours
}
```

---

## 🔗 **Required Backend API Endpoints**

### **1. QR Code Validation & Location Detection**
```
POST /api/locations/validate
Body: { qr_id: "1E01" }
Response: {
  success: true,
  location: {
    qr_id: "1E01",
    name: "Main Entrance - South",
    floor: 1,
    coordinates: { x: 5, y: 0 },
    nearby_landmarks: ["Information Desk", "ATM"]
  }
}
```

### **2. Store Directory**
```
GET /api/stores?floor=1&category=Fashion
Response: {
  stores: [
    {
      store_id: "1S01",
      name: "Zara",
      floor: 1,
      category: "Fashion",
      operating_hours: {...},
      promotions: [...]
    }
  ],
  total: 10
}
```

### **3. Route Calculation**
```
POST /api/navigation/calculate
Body: {
  start_location: "1E01",
  destination: "2FC01",
  accessibility_needed: false
}
Response: {
  route: {
    total_distance: "75m",
    estimated_time: "2 minutes", 
    steps: [
      {
        step_number: 1,
        instruction: "Walk straight 25 meters",
        direction: "straight",
        landmark: "Pass Information Desk on right",
        checkpoint_qr: "1I01", // Next QR to scan
        distance: 25,
        estimated_time: 18
      },
      // ... more steps
    ]
  },
  session_id: "abc123"
}
```

### **4. Checkpoint Progress Update**
```
POST /api/navigation/checkpoint
Body: {
  session_id: "abc123",
  scanned_qr: "1I01"
}
Response: {
  success: true,
  step_completed: 1,
  next_step: {
    step_number: 2,
    instruction: "Turn left toward escalator",
    checkpoint_qr: "1V01",
    distance: 15
  },
  progress: {
    completed: 1,
    total: 6,
    percentage: 16
  }
}
```

### **5. Emergency & Utility Endpoints**
```
GET /api/emergency/nearest-exit?location=1I01
POST /api/analytics/track-usage (optional)
GET /api/stores/:storeId/details
GET /api/health (health check)
```

---

## 🧮 **Route Calculation Algorithm**

### **A* Pathfinding Implementation:**
```javascript
class MallNavigator {
  calculateRoute(startQR, destinationQR, options = {}) {
    // 1. Get coordinates for start and destination
    const startNode = this.getLocationByQR(startQR);
    const destNode = this.getLocationByQR(destinationQR);
    
    // 2. Build navigation graph from database
    const graph = this.buildNavigationGraph();
    
    // 3. Apply A* algorithm
    const path = this.aStar(startNode, destNode, graph);
    
    // 4. Convert path to human-readable instructions
    const instructions = this.generateInstructions(path);
    
    // 5. Add checkpoint QRs for progress tracking
    const steps = this.addCheckpoints(instructions);
    
    return {
      path,
      steps,
      totalDistance: this.calculateDistance(path),
      estimatedTime: this.estimateTime(path)
    };
  }
}
```

### **Distance Calculation (Manhattan Distance):**
```javascript
calculateDistance(fromCoord, toCoord) {
  const dx = Math.abs(fromCoord.x - toCoord.x);
  const dy = Math.abs(fromCoord.y - toCoord.y);
  return (dx + dy) * 5; // Each grid unit = 5 meters
}
```

---

## 🚀 **2-Day MVP Development Plan**

### **DAY 1: Core Backend Foundation (8 hours)**

#### **Morning (4 hours): Project Setup & Data Layer**
```
Hour 1-2: Environment Setup
✅ Initialize Express.js project with TypeScript
✅ Set up MongoDB Atlas connection
✅ Configure environment variables and basic middleware
✅ Set up folder structure: /routes, /models, /services, /utils

Hour 3-4: Database Models & Dummy Data
✅ Create MongoDB schemas (Locations, Stores, NavigationGraph)
✅ Seed dummy data: 20 stores, 30 QR locations, navigation connections
✅ Create database indexes for performance
✅ Test database connections and queries
```

#### **Afternoon (4 hours): Core APIs**
```
Hour 5-6: QR Validation & Store Directory
✅ POST /api/locations/validate - QR code validation
✅ GET /api/stores - Store directory with filtering
✅ GET /api/stores/:id - Individual store details
✅ Test endpoints with Postman

Hour 7-8: Basic Route Calculation
✅ Implement simplified pathfinding (direct distance calculation)
✅ POST /api/navigation/calculate - Route calculation endpoint
✅ Generate step-by-step instructions with landmarks
✅ Test with sample routes (Entrance → Food Court)
```

### **DAY 2: Navigation Engine & Integration (8 hours)**

#### **Morning (4 hours): Advanced Routing & Session Management**
```
Hour 9-10: A* Algorithm Implementation
✅ Build navigation graph from database connections
✅ Implement proper A* pathfinding algorithm
✅ Add support for multi-floor navigation (elevators/escalators)
✅ Test complex routes with multiple checkpoints

Hour 11-12: Session & Checkpoint System
✅ Implement in-memory session storage
✅ POST /api/navigation/checkpoint - Checkpoint validation
✅ Route recalculation from checkpoint locations
✅ Progress tracking and step advancement
```

#### **Afternoon (4 hours): Testing & Deployment**
```
Hour 13-14: Integration Testing
✅ Test complete user journey end-to-end
✅ Test checkpoint scanning and route updates
✅ Handle edge cases (invalid QRs, unreachable destinations)
✅ Performance testing with multiple concurrent requests

Hour 15-16: Deployment & Documentation
✅ Deploy to Railway/Render with environment configs
✅ Test deployed APIs with live URLs
✅ Create API documentation with example requests/responses
✅ Prepare for frontend integration
```

## 🎯 **Day-by-Day Deliverables**

### **End of Day 1:**
```
✅ Working Express.js server with MongoDB
✅ 4 core API endpoints functional
✅ Dummy mall data loaded (20 stores, 30 QRs)
✅ Basic route calculation working
✅ QR validation system operational
✅ Store directory with search/filtering
```

### **End of Day 2:**
```
✅ Complete A* pathfinding algorithm
✅ Full checkpoint tracking system
✅ Session management for navigation state
✅ All 6 API endpoints tested and working
✅ Deployed backend on cloud platform
✅ Ready for frontend integration
✅ Complete API documentation
```

---

## 💻 **Technical Implementation Workflow**

### **Day 1 - Morning: Database Setup & Core Models**

#### **Project Structure:**
```
backend/
├── src/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints  
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── middleware/      # Express middleware
│   └── app.js           # Main application
├── data/                # Dummy data seeds
└── package.json
```

#### **Essential Dependencies:**
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0", 
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "express-rate-limit": "^6.7.0",
  "helmet": "^6.1.0"
}
```

### **Day 1 - Afternoon: Core API Implementation**

#### **Priority 1: QR Validation Service**
```javascript
// services/locationService.js
class LocationService {
  async validateQR(qrId) {
    const location = await Location.findOne({ qr_id: qrId, is_active: true });
    if (!location) throw new Error('Invalid QR code');
    
    return {
      qr_id: location.qr_id,
      name: location.name,
      floor: location.floor,
      coordinates: location.coordinates,
      nearby_landmarks: location.nearby_landmarks
    };
  }
}
```

#### **Priority 2: Store Directory Service** 
```javascript
// services/storeService.js  
class StoreService {
  async getStores(filters = {}) {
    const query = { is_active: true };
    if (filters.floor) query.floor = filters.floor;
    if (filters.category) query.category = filters.category;
    
    return await Store.find(query).sort({ name: 1 });
  }
}
```

### **Day 2 - Morning: Navigation Engine**

#### **Priority 1: A* Pathfinding Implementation**
```javascript
// services/navigationService.js
class NavigationService {
  async calculateRoute(startQR, destinationQR) {
    // 1. Get start and destination coordinates
    const startLoc = await Location.findOne({ qr_id: startQR });
    const destLoc = await Location.findOne({ qr_id: destinationQR });
    
    // 2. Build navigation graph from database
    const graph = await this.buildNavigationGraph();
    
    // 3. Apply A* algorithm
    const path = this.aStar(startLoc, destLoc, graph);
    
    // 4. Convert to step-by-step instructions
    const steps = await this.generateSteps(path);
    
    // 5. Create session for progress tracking
    const sessionId = this.createSession(startQR, destinationQR, steps);
    
    return {
      session_id: sessionId,
      total_distance: this.calculateTotalDistance(path),
      estimated_time: this.estimateWalkingTime(path),
      steps: steps,
      current_step: 1
    };
  }
  
  aStar(start, goal, graph) {
    const openSet = new Set([start.qr_id]);
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map([[start.qr_id, 0]]);
    const fScore = new Map([[start.qr_id, this.heuristic(start, goal)]]);
    
    while (openSet.size > 0) {
      const current = this.getLowestFScore(openSet, fScore);
      
      if (current === goal.qr_id) {
        return this.reconstructPath(cameFrom, current);
      }
      
      openSet.delete(current);
      closedSet.add(current);
      
      const neighbors = graph.get(current) || [];
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor.to_node)) continue;
        
        const tentativeGScore = gScore.get(current) + neighbor.distance;
        
        if (!openSet.has(neighbor.to_node)) {
          openSet.add(neighbor.to_node);
        } else if (tentativeGScore >= gScore.get(neighbor.to_node)) {
          continue;
        }
        
        cameFrom.set(neighbor.to_node, current);
        gScore.set(neighbor.to_node, tentativeGScore);
        fScore.set(neighbor.to_node, tentativeGScore + this.heuristic(
          await Location.findOne({ qr_id: neighbor.to_node }), goal
        ));
      }
    }
    
    throw new Error('No route found');
  }
}
```

#### **Priority 2: Session Management**
```javascript
// services/sessionService.js
class SessionService {
  constructor() {
    this.sessions = new Map(); // In-memory storage for MVP
  }
  
  createSession(startQR, destinationQR, steps) {
    const sessionId = `nav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.sessions.set(sessionId, {
      session_id: sessionId,
      start_location: startQR,
      destination: destinationQR,
      steps: steps,
      current_step: 1,
      completed_steps: [],
      created_at: new Date(),
      last_activity: new Date()
    });
    
    // Auto-expire after 2 hours
    setTimeout(() => this.sessions.delete(sessionId), 2 * 60 * 60 * 1000);
    
    return sessionId;
  }
  
  updateProgress(sessionId, scannedQR) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    
    // Validate checkpoint
    const expectedQR = session.steps[session.current_step - 1]?.checkpoint_qr;
    if (scannedQR !== expectedQR) {
      throw new Error('Invalid checkpoint - wrong QR code scanned');
    }
    
    // Update progress
    session.completed_steps.push(scannedQR);
    session.current_step += 1;
    session.last_activity = new Date();
    
    // Check if journey completed
    const isComplete = session.current_step > session.steps.length;
    
    return {
      step_completed: session.current_step - 1,
      next_step: isComplete ? null : session.steps[session.current_step - 1],
      progress: {
        completed: session.completed_steps.length,
        total: session.steps.length,
        percentage: Math.round((session.completed_steps.length / session.steps.length) * 100)
      },
      is_complete: isComplete
    };
  }
}
```

### **Day 2 - Afternoon: Integration & Deployment**

#### **Priority 1: Complete API Routes**
```javascript
// routes/navigation.js
router.post('/calculate', async (req, res) => {
  try {
    const { start_location, destination } = req.body;
    const route = await navigationService.calculateRoute(start_location, destination);
    res.json({ success: true, route });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/checkpoint', async (req, res) => {
  try {
    const { session_id, scanned_qr } = req.body;
    const progress = await sessionService.updateProgress(session_id, scanned_qr);
    res.json({ success: true, ...progress });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

#### **Priority 2: Deployment Configuration**
```javascript
// Railway deployment settings
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "engines": {
    "node": "18.x"
  }
}

// Environment variables needed:
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mall_navigation
NODE_ENV=production
```

## 🧪 **2-Day Testing Strategy**

### **Day 1 Testing:**
```
✅ Test QR validation with Postman: POST /api/locations/validate
✅ Test store directory: GET /api/stores
✅ Test basic route calculation: POST /api/navigation/calculate  
✅ Verify dummy data loads correctly
✅ Check database connections and queries
```

### **Day 2 Testing:**
```
✅ Test complete user journey: QR scan → destination → route → checkpoints
✅ Test checkpoint validation: POST /api/navigation/checkpoint
✅ Test session management and progress tracking
✅ Test error handling (invalid QRs, expired sessions)
✅ Performance test with multiple concurrent requests
✅ Deploy and test live APIs
```

---

## 🛡️ **Security & Performance Considerations**

### **Security (No Auth Required):**
```
✅ Input validation for all QR codes
✅ Rate limiting per IP (100 requests/hour)
✅ CORS configuration for web app
✅ Basic XSS and injection prevention
❌ No user authentication needed
❌ No sensitive data storage
```

### **Performance Optimization:**
```
✅ In-memory caching for mall layout
✅ Database indexing on qr_id fields
✅ Efficient graph algorithms
✅ Minimal response payloads
✅ Horizontal scaling ready
```

### **Scalability Planning:**
```
Current MVP: 100-500 concurrent users
Growth Path: Add Redis + Load Balancer
Database: MongoDB Atlas auto-scaling
Hosting: Railway → AWS/GCP as needed
```

---

## 💰 **Budget-Friendly Deployment**

### **Recommended Stack:**
```
Backend: Railway (Free tier → $5/month)
Database: MongoDB Atlas (Free 512MB)
Monitoring: Railway built-in
Domain: Free subdomain or $10/year
Total Monthly Cost: $0-15
```

### **Alternative Options:**
```
Render: Similar to Railway
Vercel: Serverless functions
Heroku: Classic but more expensive
Digital Ocean: $5/month droplet
```

---

## 📋 **2-Day Success Criteria**

### **Day 1 Checkpoint (End of Day):**
```
✅ Express server running with MongoDB connection
✅ 4 core endpoints working: /validate, /stores, /calculate, /health  
✅ Dummy data populated: 20 stores, 30 QR locations, navigation graph
✅ Basic route calculation functional (Entrance → Food Court works)
✅ QR validation system operational
✅ Postman collection with all working endpoints
✅ Code committed to repository with documentation
```

### **Day 2 Final Deliverable (End of Day):**
```
✅ Complete A* pathfinding algorithm implemented
✅ Session management with checkpoint tracking
✅ All 6 API endpoints tested and functional
✅ Complete user journey working: QR → Route → Checkpoints → Arrival
✅ Backend deployed on Railway/Render with live URLs
✅ Error handling for edge cases (invalid QRs, expired sessions)
✅ API documentation with example requests/responses
✅ Ready for frontend integration
```

## 🎯 **Immediate Next Steps for Backend Developer**

### **Hour 1-2: Quick Setup**
```
1. Create new Express.js project: npm init -y
2. Install dependencies: express, mongoose, cors, dotenv
3. Set up MongoDB Atlas cluster (free tier)
4. Create basic app.js with health check endpoint
5. Test server starts and connects to database
```

### **Hour 3-4: Data Foundation**
```
1. Create Location, Store, NavigationGraph models
2. Write seed script with dummy mall data
3. Test database operations (create, read, query)
4. Create /api/locations/validate endpoint
5. Create /api/stores directory endpoint
```

### **Priority API Endpoints (In Order):**
```
1. POST /api/locations/validate (QR validation)
2. GET /api/stores (store directory) 
3. POST /api/navigation/calculate (route calculation)
4. POST /api/navigation/checkpoint (checkpoint tracking)
5. GET /api/emergency/nearest-exit (emergency routing)
6. GET /api/health (system health check)
```

### **Final Validation Tests:**
```
Test Journey: QR "1E01" → Food Court "2FC01"
1. Validate QR: {"qr_id": "1E01"} → Returns location
2. Get stores: ?category=food → Returns food court options  
3. Calculate route: {"start": "1E01", "destination": "2FC01"} → Returns steps
4. Complete checkpoint: {"session_id": "nav_123", "scanned_qr": "1I01"} → Next step
5. Repeat until arrival confirmation
```

---

## 🎯 **Final Goal**

**Deliver a working backend API** that enables seamless QR-to-QR navigation in a shopping mall, with **sub-2-second response times** and support for **500+ concurrent users**, deployable on a **budget-friendly stack** without compromising functionality.

The backend should be **simple, fast, and scalable** - ready to power Sarah's smooth navigation experience from entrance to food court! 🛍️