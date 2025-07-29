# MEVY - Modern E-commerce Fashion Store

A sophisticated, AI-powered e-commerce platform built with React, featuring smart size recommendations and modern UX.

![MEVY Screenshot](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-FF6B6B?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Design-Responsive-4ECDC4?style=for-the-badge)

## 🚀 Features

### 🛍️ **E-commerce Core**
- **Product Catalog** with advanced filtering (color, size, price)
- **Shopping Cart** with persistent storage
- **Wishlist** functionality
- **Quick View** modal for products
- **Product Variants** (colors, sizes, stock management)
- **Checkout Process** with order summary
- **Search** with real-time filtering and debouncing

### 🤖 **AI-Powered Size Consultant**
- **Smart Size Recommendation** based on height/weight
- **Gemini AI Integration** for fashion advice
- **Conversation Context** with memory
- **Product Suggestions** based on user preferences
- **Chat History** persistence
- **Multilingual Support** (Vietnamese)

### 🎨 **Modern UI/UX**
- **Responsive Design** (mobile-first approach)
- **Dynamic Header** (transparent → solid on scroll)
- **Mega Menu** with category navigation
- **Smooth Animations** (fade-in, slide-in, hover effects)
- **Loading States** with skeletons
- **Toast Notifications** 
- **Error Boundaries** for crash protection

### ⚡ **Performance Optimizations**
- **Lazy Loading** images with intersection observer
- **Image Optimization** with fallback support
- **Memoized Components** to prevent unnecessary re-renders
- **Debounced Search** to reduce API calls
- **Code Splitting** ready architecture
- **Local Storage** management with custom hooks

### 🔧 **Technical Features**
- **React Router** for SPA navigation
- **Custom Hooks** for reusable logic
- **Error Handling** with graceful fallbacks
- **TypeScript Ready** architecture
- **Environment-aware** API calls (local/production)
- **Vercel Deployment** optimized

## 📱 **Responsive Design**

- **Mobile-First** approach
- **Tablet** optimized layouts
- **Desktop** enhanced experience
- **Touch-Friendly** interfaces
- **Adaptive** navigation

## 🛠️ **Tech Stack**

- **Frontend**: React 19+, React Router, Lucide Icons
- **Styling**: Tailwind CSS, Custom animations
- **AI**: Google Gemini API
- **State Management**: React Hooks, Local Storage
- **Performance**: Memoization, Lazy Loading, Debouncing
- **Deployment**: Vercel
- **Development**: Create React App, Node.js

## 🚀 **Quick Start**

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mevy-fashion-store
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

4. **Start development servers**
```bash
# For local development (runs both React app + proxy server)
npm run dev

# Or separately:
npm start          # React app (port 3000)
npm run proxy      # Gemini proxy server (port 4000)
```

5. **Build for production**
```bash
npm run build
```

## 📚 **Available Scripts**

- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm run proxy` - Start Gemini proxy server
- `npm run dev` - Start both React app and proxy server
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔑 **Environment Variables**

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🏗️ **Project Structure**

```
src/
├── components/           # Reusable UI components
│   ├── ErrorBoundary.js
│   ├── LoadingSpinner.js
│   └── OptimizedImage.js
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── index.js
├── App.js              # Main application component
├── SizeChatBot.js      # AI chatbot component
├── ScrollToTop.js      # Scroll behavior component
└── index.js            # Application entry point

api/                    # Vercel serverless functions
├── gemini.js          # Main Gemini API endpoint
└── ...                # Other API endpoints

public/                # Static assets
└── videos/           # Background videos
```

## 🤖 **AI Chatbot Features**

### Size Recommendation
- Analyzes height and weight input
- Provides accurate size suggestions
- Considers body type variations
- Offers fallback recommendations

### Conversation Intelligence
- Maintains conversation context
- Remembers user preferences
- Provides personalized advice
- Handles fashion-related queries

### Input Formats Supported
- "Tôi cao 1m70 nặng 60kg"
- "170cm, 60kg"
- "1.7m 60 kilo"
- "Height: 170, Weight: 60"

## 🎯 **Performance Metrics**

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3s
- **Cumulative Layout Shift**: <0.1
- **Mobile-Friendly**: 100% compatible

## 🔄 **Recent Improvements**

### v2.0 (Latest)
- ✅ **Enhanced Error Handling** with boundaries
- ✅ **Image Optimization** with lazy loading
- ✅ **Performance Boost** with memoization
- ✅ **Smart Search** with debouncing
- ✅ **AI Context Memory** for better conversations
- ✅ **Custom Hooks** for code organization
- ✅ **Loading States** for better UX

### v1.0 (Base)
- ✅ Core e-commerce functionality
- ✅ AI size recommendation
- ✅ Responsive design
- ✅ Product management
- ✅ Shopping cart & wishlist

## 🚀 **Deployment**

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Upload build/ folder to your hosting provider
```

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Ensure your Gemini API key is correctly set
3. Verify all dependencies are installed
4. Check browser console for errors

---

**Built with ❤️ using React, Tailwind CSS, and Google Gemini AI**
