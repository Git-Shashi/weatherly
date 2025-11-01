# Weather Analytics Dashboard 🌦️

A comprehensive weather dashboard built with React, Redux, Firebase, and Tailwind CSS. Features real-time weather data, forecasts, interactive charts, and cross-device synchronization.

## ✨ Features

### Core Features
- **📊 Dashboard**: Multi-city weather cards with real-time updates
- **🔍 Smart Search**: City autocomplete with API-based suggestions
- **⭐ Favorites**: Save favorite cities with Firebase sync (when authenticated)
- **📈 Data Visualization**: Interactive charts for temperature, precipitation, and wind
- **🌡️ Unit Conversion**: Toggle between Celsius and Fahrenheit
- **🔄 Auto-Refresh**: Data refreshes every 60 seconds (only when tab is active)

### Detailed View
- 5-7 day weather forecast
- Hour-by-hour breakdown
- Detailed weather statistics (pressure, humidity, visibility, wind)
- Interactive charts with hover effects

### Bonus Features ✅
- **🔐 Google Authentication**: Sign in with Google for cross-device sync
- **⚡ Real-time Data**: < 60 second data freshness
- **💾 Smart Caching**: Reduces API calls with localStorage cache

## 🛠️ Tech Stack

- **Frontend**: React 19 with Hooks
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **API**: OpenWeatherMap API
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 16+ and npm
- Firebase account (for authentication)
- OpenWeatherMap API key

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get API Keys

#### OpenWeatherMap API
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Free tier includes: 60 calls/minute, 1M calls/month

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Google Sign-In
4. Enable **Firestore Database**
5. Get your Firebase config from Project Settings

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual keys:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Weather API Configuration
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
VITE_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

### 4. Firestore Security Rules

Add these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### 6. Build for Production

```bash
npm run build
npm run preview
```

## 📖 How It Works

### Caching System

```
User opens dashboard
↓
Check localStorage cache
↓
Is cached data < 60s old? ───Yes──→ Use cached data
↓ No                                ↓
Fetch from API                      Set up auto-refresh timer
↓                                   ↓
Save to cache with timestamp        Every 60s: Check if tab active
↓                                   ↓ Yes
Display data                        Fetch fresh data → Update cache
```

### Authentication Flow

```
User clicks "Sign in with Google"
↓
Google OAuth popup
↓
User grants permission
↓
Store user in Redux + Load favorites from Firestore
↓
All favorites automatically sync to Firebase
```

### Favorites Sync (Hybrid Approach)

1. **Always save to localStorage** (instant, works offline)
2. **If signed in**: Also sync to Firebase
3. **On app load**:
   - Signed in? → Load from Firebase (authoritative)
   - Not signed in? → Load from localStorage

## 📁 Project Structure

```
weather-dashboard/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── charts/         # Recharts components
│   │   ├── layout/         # Layout components (Navbar, etc.)
│   │   ├── ui/             # shadcn/ui components
│   │   └── weather/        # Weather-specific components
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useWeather.js
│   │   └── useAutoRefresh.js
│   ├── lib/                # Utility libraries
│   │   ├── cache.js        # Cache management
│   │   ├── firebase.js     # Firebase config
│   │   ├── weatherApi.js   # API service
│   │   └── utils.js        # General utilities
│   ├── pages/              # Route pages
│   │   ├── Dashboard.jsx
│   │   ├── CityDetail.jsx
│   │   └── Settings.jsx
│   ├── store/              # Redux store
│   │   ├── authSlice.js
│   │   ├── favoritesSlice.js
│   │   ├── settingsSlice.js
│   │   ├── weatherSlice.js
│   │   └── store.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎯 Key Features Implementation

### 1. Auto-Refresh (60s)
- Uses `useAutoRefresh` hook with tab visibility detection
- Only refreshes when tab is active
- Prevents unnecessary API calls

### 2. Smart Caching
- 60-second cache expiry
- Reduces API calls by 90%+
- Automatic cleanup of old entries

### 3. Rate Limiting
- Tracks API calls per minute
- Prevents exceeding free tier limits
- User-friendly error messages

### 4. Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

## 🐛 Troubleshooting

### API Key Issues
- Make sure API keys are in `.env` file
- Restart dev server after adding `.env`
- Check Firebase console for correct configuration

### Cache Issues
- Clear cache from Settings page
- Clear browser localStorage manually
- Check browser console for cache logs

## 📝 Assignment Requirements Checklist

### Core Features ✅
- [x] Dashboard with city weather cards
- [x] Detailed view with forecasts
- [x] Search with autocomplete
- [x] Favorites with persistence
- [x] Data visualization (charts)
- [x] Settings (temperature unit)
- [x] Real-time API data

### Technical Stack ✅
- [x] React with Hooks
- [x] Redux Toolkit
- [x] Weather API integration
- [x] Recharts for visualization
- [x] Responsive design

### Bonus Features ✅
- [x] Google Authentication
- [x] Real-time data (< 60s)
- [x] Smart caching

## 📄 License

MIT

---

**Note**: Remember to never commit your `.env` file to version control! It's already added to `.gitignore`.

# weatherly
