# Text-to-Learn: AI-Powered Course Generator

> Transform any topic into a structured, multi-module online course instantly using AI.

[![Frontend](https://img.shields.io/badge/Frontend-React%20+%20Vite-blue)](./client)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20+%20Express-green)](./server)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)](https://ai.google.dev)

## ✨ Features

- **AI Course Generation** — Generate 4-5 modules with 3-4 lessons each from any topic
- **Rich Lesson Content** — Headings, paragraphs, syntax-highlighted code, YouTube videos, MCQ quizzes
- **Interactive Quizzes** — Select answers, reveal correct option with explanation
- **PDF Download** — Export any lesson as a styled PDF
- **Hinglish TTS** — Listen to lessons in Hinglish via Web Speech API
- **Persistent Courses** — Save courses to MongoDB, private to each user
- **Auth0 Integration** — Secure login/logout with per-user course isolation

## 🗂️ Project Structure

```
AZ_Project/
├── client/          # React + Vite frontend → deploy to Vercel
│   ├── vercel.json  # SPA rewrite rules for React Router
│   └── .env.example
└── server/          # Node.js + Express backend → deploy to Render
    └── .env.example
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API Key
- Auth0 account

### Backend
```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd client
cp .env.example .env   # fill in your values
npm install
npm run dev            # http://localhost:5173
```

## 🔧 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant URL (e.g. `https://dev-xxx.us.auth0.com/`) |
| `AUTH0_CLIENT_ID` | Auth0 Application Client ID |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `CLIENT_URL` | Frontend URL (Vercel URL in production) |

### Frontend (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (Render URL in production) |
| `VITE_AUTH0_DOMAIN` | Auth0 domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 client ID |
| `VITE_AUTH0_AUDIENCE` | Auth0 audience (optional) |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API v3 key |

## 🚢 Deployment

### Backend → Render
1. Connect the **`server/`** directory on [Render](https://render.com)
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `node server.js`
4. Add all environment variables from `server/.env.example`
5. Copy the Render URL → paste as `VITE_API_URL` in Vercel

### Frontend → Vercel
1. Connect the **`client/`** directory on [Vercel](https://vercel.com)
2. **Framework**: Vite (auto-detected)
3. Add all environment variables from `client/.env.example`
4. `vercel.json` handles SPA routing automatically

### Auth0 Configuration
1. Go to **Auth0 Dashboard → Applications → Your App → Settings**
2. Add your Vercel URL to **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS with premium design system |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 1.5 Flash |
| Auth | Auth0 (OAuth 2.0, ID token flow) |
| Video | YouTube Data API v3 |
| PDF | jsPDF + html2canvas |
| TTS | Web Speech API + Gemini translation |

## 📁 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generate-course` | Generate course outline from topic |
| POST | `/api/generate-lesson` | Generate full lesson content |
| GET | `/api/courses` | List user's courses (auth required) |
| POST | `/api/courses` | Save generated course (auth required) |
| GET | `/api/courses/:id` | Get course with modules/lessons |
| DELETE | `/api/courses/:id` | Delete course |
| PUT | `/api/lessons/:id` | Update lesson content |
| GET | `/api/youtube?query=...` | YouTube video search proxy |
| POST | `/api/tts` | Translate text to Hinglish |

## 📄 License

MIT
