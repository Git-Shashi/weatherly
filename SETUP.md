# 🚀 Quick Setup Guide

## ⚠️ IMPORTANT: Configure API Keys First!

Before running the application, you MUST set up your API keys.

### Step 1: Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

### Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (name it anything you like)
3. Enable **Authentication**:
   - Click "Authentication" in left sidebar
   - Click "Get Started"
   - Enable "Google" as a sign-in provider
4. Enable **Firestore Database**:
   - Click "Firestore Database" in left sidebar
   - Click "Create Database"
   - Select "Start in test mode"
   - Choose a location
5. Get Firebase Config:
   - Click the gear icon → Project Settings
   - Scroll down to "Your apps"
   - Click the web icon (</>) to create a web app
   - Copy the `firebaseConfig` object

### Step 3: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace placeholder values with your actual keys:

```env
# Replace these with your Firebase config values:
VITE_FIREBASE_API_KEY=AIzaSy... (from Firebase)
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Replace with your OpenWeatherMap API key:
VITE_WEATHER_API_KEY=your_actual_api_key_here
```

### Step 4: Set Firestore Security Rules

1. In Firebase Console → Firestore Database
2. Click "Rules" tab
3. Replace with:

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

4. Click "Publish"

### Step 5: Run the App

The development server should already be running at:
**http://localhost:5173/**

If not, run:
```bash
npm run dev
```

## ✅ Testing the App

### Without Authentication (Basic Mode):
1. App will load with default cities (Delhi, Mumbai, Bangalore)
2. Search for cities using the search bar
3. Click on a city card to see detailed forecast
4. Favorites will be saved in localStorage (browser-specific)

### With Authentication (Full Features):
1. Click "Sign in with Google" in the top-right
2. Sign in with your Google account
3. Your favorites will now sync to Firebase
4. Access your favorites from any device!

## 🎯 Features to Test

- **Auto-Refresh**: Watch the cache age counter - it updates every 60 seconds
- **Cache System**: Notice "Cache HIT" messages in browser console
- **Favorites**: Star cities to save them
- **Charts**: Click on a city to see interactive charts
- **Settings**: Toggle between Celsius and Fahrenheit
- **Responsive**: Resize browser window to see mobile view

## 🐛 Common Issues

### "city not found" Error
- Check your OpenWeatherMap API key in `.env`
- Make sure you're connected to the internet
- Wait a few minutes after creating your API key

### Authentication Not Working
- Verify all Firebase config values in `.env`
- Make sure Google Sign-In is enabled in Firebase Console
- Check browser console for detailed error messages

### App Not Loading
- Make sure you're at http://localhost:5173
- Check browser console for errors
- Verify all npm dependencies are installed: `npm install`

## 📊 Monitoring

Open browser console (F12) to see:
- Cache hit/miss logs
- API call tracking
- Auto-refresh timers
- Firebase sync status

## 🎉 You're All Set!

The app is now fully configured and ready to use. Enjoy exploring weather data with auto-refresh, smart caching, and cross-device sync!

---

**Need Help?** Check the main README.md for more detailed information.
