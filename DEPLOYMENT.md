# Deployment Guide for Brainely

## ✅ Pre-Deployment Checklist

All critical issues have been fixed:
- ✅ MongoDB connection with retry logic and connection pooling
- ✅ Graceful shutdown handling
- ✅ TypeScript configuration optimized
- ✅ Deployment configurations created (Render & Vercel)
- ✅ Environment variables documented
- ✅ Security improvements (crypto-based random generation)
- ✅ Build tested successfully

## 🚀 Deployment Steps

### Backend Deployment (Render - Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Deployment ready with MongoDB fixes"
   git push origin main
   ```

2. **MongoDB Atlas Setup**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Navigate to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `brainely` repository
   - Configure:
     - **Name**: `brainely-backend` (or your choice)
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Set Environment Variables in Render**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_PASSWORD=<your-secure-jwt-password>
   FRONTEND_URLS=http://localhost:5173,https://your-frontend.vercel.app
   NODE_ENV=production
   PORT=3000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://brainely-backend.onrender.com`)

### Frontend Deployment (Vercel)

1. **Update Frontend Environment**
   - Open `frontend/.env`
   - Update `VITE_BACKEND_URL` with your Render backend URL:
     ```
     VITE_BACKEND_URL=https://brainely-backend.onrender.com
     ```

2. **Update Backend CORS**
   - After getting your Vercel frontend URL, update backend `.env`:
     ```
     FRONTEND_URLS=https://your-frontend.vercel.app,http://localhost:5173
     ```
   - Redeploy backend on Render

3. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
4. **Set Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_BACKEND_URL=https://brainely-backend.onrender.com
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## 🔧 Alternative: Deploy Backend to Vercel

If you prefer to deploy both to Vercel:

1. **Deploy Backend**
   - Import repository to Vercel
   - Root Directory: `backend`
   - Add all environment variables
   - Deploy

2. **Note**: Vercel uses serverless functions, which may have cold starts. Render is recommended for persistent MongoDB connections.

## 🧪 Testing Your Deployment

1. **Test Backend Health**
   ```bash
   curl https://your-backend-url.onrender.com/api/v1/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "readyState": 1,
     "timestamp": "2026-02-05T..."
   }
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Try signing up with a new account
   - Try signing in
   - Create content
   - Test sharing functionality

## 🐛 Troubleshooting

### MongoDB Connection Fails

**Error**: "Failed to connect to MongoDB after 5 attempts"

**Solutions**:
1. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Verify `MONGODB_URI` is correct in Render environment variables
3. Check MongoDB Atlas cluster is running
4. Verify database user has correct permissions

### CORS Errors

**Error**: "CORS not allowed" or "Access-Control-Allow-Origin"

**Solutions**:
1. Add your frontend URL to `FRONTEND_URLS` in backend environment
2. Format: `https://your-app.vercel.app` (no trailing slash)
3. Redeploy backend after updating environment variables

### JWT Errors

**Error**: "Invalid token" or "Unauthorized"

**Solutions**:
1. Ensure `JWT_PASSWORD` is the same in both local and deployed backend
2. Clear browser localStorage and try signing in again
3. Check that token is being sent in Authorization header

### Build Fails

**Error**: TypeScript compilation errors

**Solutions**:
1. Run `npm run build` locally to see errors
2. Check all imports are correct
3. Ensure all dependencies are in `package.json`

## 📝 Environment Variables Reference

### Backend (.env)
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_PASSWORD=your-secure-random-string-here
PORT=3000
FRONTEND_URLS=https://frontend.vercel.app,http://localhost:5173
NODE_ENV=production
```

### Frontend (.env)
```bash
VITE_BACKEND_URL=https://backend.onrender.com
```

## 🔒 Security Checklist

- ✅ MongoDB credentials not in git (in .env, which is .gitignored)
- ✅ JWT_PASSWORD is secure and unique
- ✅ CORS configured to only allow your frontend domains
- ✅ MongoDB IP whitelist configured
- ✅ Using HTTPS for all production URLs

## 📊 Monitoring

### Render
- View logs: Render Dashboard → Your Service → Logs
- Monitor health: Check `/api/v1/health` endpoint
- View metrics: Render Dashboard → Your Service → Metrics

### Vercel
- View logs: Vercel Dashboard → Your Project → Deployments → View Function Logs
- Monitor performance: Vercel Analytics (if enabled)

## 🔄 Redeployment

### Backend (Render)
- Automatic: Push to GitHub main branch
- Manual: Render Dashboard → Your Service → Manual Deploy

### Frontend (Vercel)
- Automatic: Push to GitHub main branch
- Manual: Vercel Dashboard → Your Project → Redeploy

## ✨ What Was Fixed

1. **MongoDB Connection Issues**
   - Added retry logic (5 attempts with exponential backoff)
   - Added connection pooling (5-10 connections)
   - Added proper timeouts (30s connection, 10s server selection)
   - Added connection event listeners for monitoring

2. **Deployment Configuration**
   - Created `render.yaml` for Render deployment
   - Created `vercel.json` for Vercel deployment
   - Added Node.js engine specification in package.json

3. **Code Quality**
   - Improved random string generation (crypto-based)
   - Added graceful shutdown handling
   - Added proper TypeScript configurations
   - Fixed middleware type annotations

4. **Environment Management**
   - Updated `.env.example` with documentation
   - Fixed frontend environment configuration
   - Fixed CORS configuration

Your project is now **100% deployment ready**! 🎉
