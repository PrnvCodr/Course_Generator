# Text-to-Learn: AI-Powered Course Generator

> Transform any topic into a structured, multi-module online course instantly using AI.

[![Frontend](https://img.shields.io/badge/Frontend-React%20+%20Vite-blue)](./client)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20+%20Express-green)](./server)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)](https://ai.google.dev)
<img width="1676" height="699" alt="Screenshot 2026-03-21 175100" src="https://github.com/user-attachments/assets/1dfc08eb-b546-4453-9685-4af20cb0998a" />

## ✨ Features

- **AI Course Generation** — Generate 4-5 modules with 3-4 lessons each from any topic
- **Rich Lesson Content** — Headings, paragraphs, syntax-highlighted code, YouTube videos, MCQ quizzes
- **Interactive Quizzes** — Select answers, reveal correct option with explanation
- **PDF Download** — Export any lesson as a styled PDF
- **Hinglish TTS** — Listen to lessons in Hinglish via Web Speech API
- **Persistent Courses** — Save courses to MongoDB for later access
- **Auth0 Integration** — Secure login/logout (optional)

## 🗂️ Project Structure

```
project-root/
├── client/          # React + Vite frontend (deploy to Vercel)
└── server/          # Node.js + Express backend (deploy to Render)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API Key
- YouTube Data API Key (optional)
- Auth0 account (optional)

### Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
# Runs on http://localhost:5173
```

## 🔧 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant URL |
| `AUTH0_AUDIENCE` | Auth0 API identifier |

### Frontend (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (default: http://localhost:5000) |
| `VITE_AUTH0_DOMAIN` | Auth0 domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 client ID |

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS with premium design system |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 1.5 Flash |
| Auth | Auth0 (OAuth 2.0) |
| Video | YouTube Data API v3 |
| PDF | jsPDF + html2canvas |
| TTS | Web Speech API + Gemini translation |

## 🚢 Deployment

- **Frontend** → [Vercel](https://vercel.com): connect `client/` directory
- **Backend** → [Render](https://render.com): connect `server/` directory

## 📁 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generate-course` | Generate course outline from topic |
| POST | `/api/generate-lesson` | Generate full lesson content |
| GET | `/api/courses` | List all courses |
| POST | `/api/courses` | Save generated course |
| GET | `/api/courses/:id` | Get course with modules/lessons |
| DELETE | `/api/courses/:id` | Delete course |
| PUT | `/api/lessons/:id` | Update lesson content |
| GET | `/api/youtube?query=...` | YouTube video search proxy |
| POST | `/api/tts` | Translate text to Hinglish |

## 📄 License

MIT
