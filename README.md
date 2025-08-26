# QR Code Mall Navigation System

A modern, responsive web application for indoor mall navigation using QR codes. This system provides turn-by-turn directions, interactive floor plans, and seamless wayfinding for mall visitors.

## 🚀 Features

### Core Navigation
- **QR Code Location Detection** - Scan or simulate QR codes to determine current location
- **Smart Store Directory** - Searchable, categorized store listings with real-time information
- **Turn-by-Turn Navigation** - Step-by-step directions with visual progress tracking
- **Interactive Floor Plans** - SVG-based maps with zoom, pan, and route visualization
- **Multi-Floor Support** - Seamless navigation between different mall levels

### User Experience
- **Mobile-First Design** - Optimized for smartphones with large touch targets
- **Progressive Web App** - Installable with offline capabilities
- **Multi-Language Support** - English, Hindi, Kannada language options
- **Accessibility Features** - WCAG compliant with screen reader support
- **Real-Time Status** - Online/offline indicators and connection monitoring

### Quick Actions
- **Emergency Exit Routing** - Instant directions to nearest emergency exits
- **Amenity Finder** - Quick access to restrooms, customer service, parking
- **Store Information** - Operating hours, contact details, and promotional offers
- **Route Sharing** - Share navigation routes with others

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI + shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Lucide React
- **Notifications**: Sonner toast system

## 📱 Demo Functionality

The application includes comprehensive demo data for testing:

### Sample QR Locations
- `1E01` - Main Entrance (South)
- `1I02` - Central Court Area  
- `1S01` - Near Zara Store
- `2I01` - Floor 2 Escalator

### Sample Stores
- **Floor 1**: Zara, Nike, Apple Store, Starbucks, McDonald's
- **Floor 2**: Food Court, Electronics Store, BookStore, GameZone, Fitness Center

### Pre-Calculated Routes
- Main Entrance → Food Court (6 steps, 2 minutes)
- Zara Store → Electronics Store (4 steps, 1.5 minutes)
- Central Court → Emergency Exit (3 steps, 1 minute)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
bun install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 How to Use

### For Mall Visitors

1. **Scan QR Code** - Use your phone camera to scan QR codes located throughout the mall
2. **Select Destination** - Browse the store directory or search for specific stores
3. **Get Directions** - View your route and tap "Start Navigation"
4. **Follow Steps** - Use Next/Previous buttons to progress through navigation steps
5. **Quick Actions** - Access emergency exits, restrooms, or customer service instantly

### Demo Mode Testing

1. **Select Demo Location** - Use the dropdown at the bottom to simulate different QR codes
2. **Test Navigation** - Try navigating between various stores and floors
3. **Emergency Features** - Test emergency exit routing and quick actions
4. **Multi-Floor** - Switch between floors using the floor plan toggle

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── CurrentLocation.tsx    # Location display
│   ├── StoreDirectory.tsx     # Store browsing
│   ├── RouteDisplay.tsx       # Navigation interface
│   ├── FloorPlan.tsx          # Interactive maps
│   ├── QuickActions.tsx       # Emergency & utilities
│   └── EmergencyOverlay.tsx   # Emergency modal
├── lib/                 # Utilities and data
│   ├── mallData.ts      # Demo data and routing logic
│   └── utils.ts         # Helper functions
├── pages/               # Route components
│   ├── Index.tsx        # Main application
│   └── NotFound.tsx     # 404 page
├── hooks/               # Custom React hooks
├── assets/              # Static assets
└── styles/              # Global styles
```

## 🎨 Design System

The application uses a comprehensive design system with semantic tokens:

### Color Palette
- **Primary**: Brand blue with gradient variations
- **Secondary**: Complementary accent colors
- **Semantic**: Success, warning, error states
- **Neutral**: Text and background variations

### Typography
- **Headings**: Inter font family with proper hierarchy
- **Body**: Optimized for readability on mobile devices
- **Interactive**: Clear button and link styling

### Components
- **Cards**: Consistent elevation and spacing
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Accessible inputs with validation states
- **Navigation**: Clear breadcrumbs and progress indicators

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for configuration:

```env
VITE_APP_TITLE=MallNav
VITE_DEFAULT_LANGUAGE=en
VITE_API_BASE_URL=http://localhost:3000
```

### Customization
- **Mall Data**: Update `src/lib/mallData.ts` with actual mall information
- **Styling**: Modify `src/index.css` and `tailwind.config.ts` for branding
- **Languages**: Add translations in component files
- **Routes**: Configure navigation paths in mall data structure

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Custom Server
```bash
npm run build
# Serve dist/ folder with any static file server
```

### Lovable Platform
Simply open [Lovable](https://lovable.dev/projects/4a95fb60-1598-4e4b-b222-73bb0b575488) and click on Share → Publish.

## 🔮 Future Enhancements

### Planned Features
- **Real-time Analytics** - Visitor flow and popular destinations
- **Store Promotions** - Dynamic offers and notifications  
- **Social Features** - Share routes and meet friends
- **AR Integration** - Augmented reality wayfinding
- **Voice Navigation** - Audio step-by-step directions

### Technical Improvements
- **Backend Integration** - REST API for dynamic data
- **Database** - Store and route management system
- **Authentication** - User accounts and preferences
- **Push Notifications** - Store offers and announcements
- **Advanced PWA** - Background sync and offline maps

### Accessibility Enhancements
- **Voice Commands** - Hands-free navigation
- **High Contrast Mode** - Enhanced visibility options
- **Text-to-Speech** - Audio route instructions
- **Gesture Navigation** - Alternative input methods

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain responsive design principles
- Test on multiple devices and browsers
- Ensure accessibility compliance

## 🔧 GitHub Integration

This project is connected to Lovable's GitHub integration:

### Automatic Sync
- Changes made in Lovable automatically push to GitHub
- Changes pushed to GitHub automatically sync to Lovable
- Real-time bidirectional synchronization

### Local Development
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

### Deployment Options
- **Lovable**: Share → Publish for instant deployment
- **Custom Domain**: Project → Settings → Domains → Connect Domain
- **Self-Hosting**: Deploy the standard React app to any hosting provider

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first styling framework
- **Lucide** - Beautiful icon library
- **React Team** - Amazing frontend framework
- **Vite** - Lightning-fast build tool
- **Lovable** - AI-powered development platform

## 📞 Support

For questions, issues, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the [Lovable documentation](https://docs.lovable.dev/)

---

**Built with ❤️ for seamless mall navigation experiences**
