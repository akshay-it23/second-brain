# 🧪 Postman Testing Guide

## ✅ Server is Running!

Your backend server is now running successfully on **http://localhost:3000**

## 📥 Import Postman Collection

1. Open Postman
2. Click "Import" button (top left)
3. Select the file: `Brainely_API.postman_collection.json`
4. Click "Import"

## 🧪 Test the API (Step-by-Step)

### Step 1: Health Check
**Request:** GET http://localhost:3000/api/v1/health

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "readyState": 1,
  "timestamp": "2026-02-05T..."
}
```

---

### Step 2: Create Account (Signup)
**Request:** POST http://localhost:3000/api/v1/signup

**Body:**
```json
{
  "username": "testuser",
  "password": "testpass123"
}
```

**Expected Response:**
```json
{
  "message": "user signed up"
}
```

---

### Step 3: Sign In
**Request:** POST http://localhost:3000/api/v1/signin

**Body:**
```json
{
  "username": "testuser",
  "password": "testpass123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:** The token is automatically saved to Postman environment variable `auth_token`

---

### Step 4: Add Content
**Request:** POST http://localhost:3000/api/v1/content

**Headers:**
- Authorization: `Bearer {{auth_token}}`
- Content-Type: `application/json`

**Body:**
```json
{
  "title": "My First Note",
  "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "type": "youtube"
}
```

**Expected Response:**
```json
{
  "message": "content added"
}
```

---

### Step 5: Get All Content
**Request:** GET http://localhost:3000/api/v1/content

**Headers:**
- Authorization: `Bearer {{auth_token}}`

**Expected Response:**
```json
{
  "content": [
    {
      "_id": "...",
      "title": "My First Note",
      "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "type": "youtube",
      "userId": "...",
      "tags": []
    }
  ]
}
```

---

### Step 6: Enable Brain Sharing
**Request:** POST http://localhost:3000/api/v1/brain/share

**Headers:**
- Authorization: `Bearer {{auth_token}}`
- Content-Type: `application/json`

**Body:**
```json
{
  "share": true
}
```

**Expected Response:**
```json
{
  "hash": "abc123xyz"
}
```

**Important:** The hash is automatically saved to `share_hash` variable

---

### Step 7: View Shared Brain
**Request:** GET http://localhost:3000/api/v1/brain/{{share_hash}}

**No authentication required!**

**Expected Response:**
```json
{
  "username": "testuser",
  "content": [
    {
      "_id": "...",
      "title": "My First Note",
      "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "type": "youtube"
    }
  ]
}
```

---

## 🎯 Quick Test Sequence

1. ✅ Health Check
2. ✅ Signup with new username
3. ✅ Signin (token auto-saved)
4. ✅ Add Content (uses saved token)
5. ✅ Get Content (uses saved token)
6. ✅ Share Brain (hash auto-saved)
7. ✅ View Shared Brain (no auth needed)

---

## 🐛 Common Issues

### Issue: "Unauthorized : No token provided"
**Solution:** Make sure you ran the Signin request first. The token is automatically saved.

### Issue: "CORS not allowed"
**Solution:** This won't happen in Postman (only in browsers). You're good!

### Issue: "Database not available"
**Solution:** Check if MongoDB is connected. Run Health Check endpoint.

### Issue: "incorrect credential"
**Solution:** 
- Make sure you signed up first
- Check username/password spelling
- Try creating a new user

---

## 📊 Server Status

**Server:** ✅ Running on http://localhost:3000  
**Database:** ✅ Connected to MongoDB  
**Status:** Ready for testing!

---

## 🔄 Restart Server

If you need to restart the server:

```bash
# Stop: Press Ctrl+C in the terminal
# Start: npm start
```

---

## 🚀 Next Steps

Once testing is complete:
1. All endpoints work? ✅ Ready to deploy!
2. Follow `DEPLOYMENT.md` to deploy to Render/Vercel
3. Update Postman collection URLs to deployed backend

**Happy Testing!** 🎉
