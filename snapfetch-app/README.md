# 📽️ SnapFetch - Multi-Platform Video Downloader

A sleek, minimalistic web application that allows users to download videos and audio from popular platforms like YouTube, TikTok, Instagram, and Facebook.

## ✨ Features

- 🌐 **Multi-Platform Support**: Download from YouTube, TikTok, Instagram, Facebook
- 🎬 **Multiple Formats**: MP4 (video) and MP3 (audio) downloads
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🌑 **Dark Theme**: Eye-friendly dark theme with laser-inspired aesthetics
- ⚡ **Fast Processing**: Quick video information extraction (1-2 seconds)
- 📊 **Real-time Progress**: Download progress tracking with speed indicators
- 🔧 **Multiple Quality Options**: Choose from various video resolutions and audio qualities

## 🛠️ Tech Stack

- **Frontend**: React.js with Vite + Tailwind CSS
- **Backend**: Node.js with Express.js
- **Download Engine**: yt-dlp for reliable cross-platform downloading
- **Icons**: Lucide React for modern SVG iconography

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.6+ (for yt-dlp)

### Installation

1. **Clone or download the project:**
   ```bash
   # Navigate to your projects directory
   cd your-projects-directory
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd snapfetch-app/backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Verify yt-dlp Installation:**
   The project includes a local copy of yt-dlp. To verify it's working:
   ```bash
   cd ../
   ./yt-dlp --version
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser and visit:** `http://localhost:3000`

## 🎯 Usage Guide

1. **Paste Video URL**: Copy and paste a video URL from YouTube, TikTok, Instagram, or Facebook
2. **Extract Info**: Click the "Extract Info" button to analyze the video
3. **Choose Format**: Select your preferred quality from the available options
4. **Download**: Click the download button for your chosen format
5. **Enjoy**: The file will be saved to your browser's default download location

### Supported Platforms

- ✅ YouTube (videos, playlists, shorts)
- ✅ TikTok (videos, profiles)
- ✅ Instagram (videos, reels, IGTV)
- ✅ Facebook (videos, posts)
- ✅ And many more supported by yt-dlp

## 📱 Browser Compatibility

SnapFetch works on all modern browsers:
- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Configuration

### Backend Configuration

The backend server can be configured by modifying `backend/server.js`:

```javascript
const PORT = process.env.PORT || 5000; // Change port here
```

### Frontend Configuration

The frontend development server can be configured in `frontend/vite.config.js`:

```javascript
server: {
  port: 3000, // Change port here
  proxy: {
    '/api': {
      target: 'http://localhost:5000', // Backend URL
      changeOrigin: true,
    },
  },
}
```

## 🛡️ Error Handling

SnapFetch includes comprehensive error handling for:
- Invalid URLs
- Unsupported platforms
- Network connectivity issues
- Download failures
- Server errors

## 🚀 Production Deployment

### Backend Deployment

1. Build for production:
   ```bash
   cd backend
   npm install --production
   ```

2. Set environment variables:
   ```bash
   export PORT=5000
   export NODE_ENV=production
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the built files using a static file server or deploy to platforms like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

## 📁 Project Structure

```
snapfetch-app/
├── backend/                 # Express.js backend
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── index.css      # Tailwind CSS styles
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── node_modules/      # Frontend dependencies
├── yt-dlp                 # Video downloader executable
└── README.md              # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This tool is for educational purposes only. Please respect copyright laws and the terms of service of the platforms you're downloading from. Always ensure you have the right to download and use the content.

## 🆘 Troubleshooting

### Common Issues

1. **"yt-dlp not found" error:**
   - Ensure the yt-dlp executable is in the project root
   - Check file permissions: `chmod +x yt-dlp`

2. **CORS errors:**
   - Ensure the backend server is running on port 5000
   - Check that the proxy configuration in vite.config.js is correct

3. **Download failures:**
   - Check your internet connection
   - Verify the video URL is valid and accessible
   - Some platforms may have restrictions

4. **Port already in use:**
   - Change the port in the respective configuration files
   - Kill any processes using the default ports

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Check the backend server logs
3. Ensure all dependencies are installed correctly
4. Verify yt-dlp is working: `./yt-dlp --version`

---

Made with ❤️ for seamless video downloads