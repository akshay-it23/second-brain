<markdown<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=200&section=header&text=2nd%20Brain%20🧠&fontSize=52&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Your%20Personal%20Knowledge%20Hub%20on%20the%20Internet&descAlignY=58&descSize=18" width="100%"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=3000&pause=1000&color=A78BFA&center=true&vCenter=true&multiline=true&width=650&height=90&lines=Store.+Organize.+Share.+🚀;Your+second+brain+lives+on+the+web+🌐;Built+with+React+%2B+TypeScript+%2B+Node.js+⚡)](https://git.io/typing-svg)

![License](https://img.shields.io/badge/License-MIT-7c3aed?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-LTS-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-00d9ff?style=for-the-badge)

</div>

---

## 🧠 What is 2nd Brain?

> *"Your mind is for having ideas, not holding them."* – David Allen

**2nd Brain** is a personal knowledge management platform that lets you **capture, organize, and share** content from across the internet — all in one place. Save Twitter threads, YouTube videos, Instagram posts, and more. Categorize them your way. Share your entire knowledge base with a single link.

Think of it as your **digital memory** — always organized, always accessible.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Auth** | JWT-based sign up & login |
| 📌 **Embed Posts** | Save Twitter, YouTube, Instagram & more |
| 🗂️ **Categorization** | Organize content into custom categories |
| 🧠 **View Brain** | Visualize your entire knowledge base |
| 🔗 **Share Brain** | One link to share everything with anyone |
| 📱 **Responsive UI** | Works seamlessly on all devices |

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Database & DevOps
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

---

## 🏗️ Architecture
2nd-brain/
├── 📁 frontend/               # React + TypeScript app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # Auth & global state
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── 📁 backend/                # Node.js + Express API
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # MongoDB schemas
│   │   ├── middleware/        # Auth & error middleware
│   │   └── config/            # DB & env config
│   └── package.json
│
└── README.md

---

## ⚡ Quick Start

### Prerequisites

Make sure you have these installed:

- ![Node.js](https://img.shields.io/badge/Node.js-Latest_LTS-43853D?style=flat-square&logo=node.js)
- ![MongoDB](https://img.shields.io/badge/MongoDB-Local_or_Atlas-4EA94B?style=flat-square&logo=mongodb)
- ![Git](https://img.shields.io/badge/Git-any-F05032?style=flat-square&logo=git)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/2nd-brain.git
cd 2nd-brain
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

> 🟢 Server running at `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

> 🌐 App running at `http://localhost:3000`

---

## 📖 Usage Guide

📝  Sign up for a new account (or log in)
➕  Click "Add Content" and paste any social media URL
🗂️  Assign a category (e.g. Learning, Inspiration, Dev)
🧠  Navigate to "My Brain" to see all saved content
🔗  Hit "Share Brain" to generate your public link
🚀  Share the link — anyone can now browse your Brain!


---

## 🔌 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/signup` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/api/content` | Get all user content | ✅ |
| `POST` | `/api/content` | Add new content | ✅ |
| `DELETE` | `/api/content/:id` | Delete content item | ✅ |
| `GET` | `/api/brain/share` | Get shareable link | ✅ |
| `GET` | `/api/brain/:shareId` | View shared brain | ❌ |

---

## 🗺️ Roadmap

- [x] User authentication (JWT)
- [x] Save & embed social media posts
- [x] Content categorization
- [x] View Brain dashboard
- [x] Shareable Brain link
- [ ] 🤖 AI-based auto-categorization
- [ ] 🔍 Full-text search across saved content
- [ ] 🌙 Dark mode & customizable themes
- [ ] 📱 Mobile app (React Native)
- [ ] 🔔 Browser extension to save content on the go
- [ ] 📊 Analytics — most saved topics, engagement stats
- [ ] 🤝 Collaborative brains (shared workspaces)

---

## 🤝 Contributing

Contributions are what make open source amazing! Here's how to get started:

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request 🎉
```

Please read our [Contributing Guidelines](CONTRIBUTING.md) and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

### ⭐ If you found this useful, please star the repo!

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/2nd-brain&type=Date)](https://star-history.com/#your-username/2nd-brain&Date)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=100&section=footer" width="100%"/>

*Built with ❤️ by [Akshay](https://github.com/your-username)*

</div>
