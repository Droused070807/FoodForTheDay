# Food For The Day - LSU Dining Menu

A modern web app to view daily menus from LSU's 459 Commons dining hall. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🍽️ View breakfast, lunch, and dinner menus
- 📊 See nutritional information (calories, protein, carbs, fat, sugar)
- 🌱 Filter by vegan/vegetarian options
- 🏆 Highlight highest protein options
- 📱 Fully responsive design
- ⚡ Fast and optimized

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Puppeteer
- **Icons**: Lucide React

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Chrome/Chromium (for Puppeteer)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FoodForTheDay
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:3001
   ```

5. **Start the frontend dev server** (in a new terminal)
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Deployment

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Deploy Frontend to Vercel:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable:
     - `VITE_API_URL` = `https://your-backend-url.railway.app`
   - Click "Deploy"

#### Deploy Backend to Railway:

1. **Install Railway CLI** (optional)
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy via Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `server`
   - Railway will auto-detect Node.js
   - Add environment variables if needed
   - Deploy!

3. **Get your backend URL**
   - Railway will provide a URL like `https://your-app.railway.app`
   - Update `VITE_API_URL` in Vercel with this URL

### Option 2: Netlify (Frontend) + Render (Backend)

#### Deploy Frontend to Netlify:

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repo
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variable:
     - `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Click "Deploy site"

#### Deploy Backend to Render:

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - Name: `food-for-the-day-api`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Plan: Free (or paid for better performance)

3. **Add environment variables** (if needed)
   - Click "Environment" tab
   - Add any required variables

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Copy the provided URL and update `VITE_API_URL` in Netlify

### Option 3: Full Stack on Railway

Deploy both frontend and backend on Railway:

1. **Create two services on Railway**
   - Service 1: Frontend (root directory: `.`)
   - Service 2: Backend (root directory: `server`)

2. **Configure Frontend Service**
   - Build Command: `npm run build`
   - Start Command: `npx serve -s dist -l $PORT`
   - Add environment variable: `VITE_API_URL` = `${{Backend.RAILWAY_PUBLIC_DOMAIN}}`

3. **Configure Backend Service**
   - Start Command: `node index.js`
   - No build command needed

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001  # Local development
# VITE_API_URL=https://your-backend-url.railway.app  # Production
```

### Backend
- `PORT` - Server port (default: 3001, auto-set by hosting platform)

## Build for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
FoodForTheDay/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── server/                # Backend server
│   ├── index.js           # Express server
│   └── scrape.js          # Puppeteer scraper
├── dist/                  # Production build (generated)
└── package.json           # Frontend dependencies
```

## Troubleshooting

### Backend Issues
- **Puppeteer not working**: Make sure Chrome/Chromium is installed
- **CORS errors**: Check that `cors` middleware is enabled
- **Slow scraping**: First request is slower due to browser initialization

### Frontend Issues
- **API connection failed**: Check `VITE_API_URL` environment variable
- **Build errors**: Run `npm run build` locally to see errors

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
