import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60s for AI generation
})

// Auth token interceptor — attach Bearer token if available
let getAccessTokenSilently = null

export const setTokenGetter = (fn) => {
  getAccessTokenSilently = fn
}

api.interceptors.request.use(async (config) => {
  if (getAccessTokenSilently) {
    try {
      const token = await getAccessTokenSilently()
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // Not logged in, continue without token
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ── API Helpers ──

export const generateCourse = (topic) =>
  api.post('/api/generate-course', { topic })

export const generateLesson = (courseTitle, moduleTitle, lessonTitle) =>
  api.post('/api/generate-lesson', { courseTitle, moduleTitle, lessonTitle })

export const saveCourse = (courseData) =>
  api.post('/api/courses', courseData)

export const getCourses = () =>
  api.get('/api/courses')

export const getCourseById = (id) =>
  api.get(`/api/courses/${id}`)

export const deleteCourse = (id) =>
  api.delete(`/api/courses/${id}`)

export const updateLesson = (id, data) =>
  api.put(`/api/lessons/${id}`, data)

export const getYouTubeVideo = (query) =>
  api.get(`/api/youtube?query=${encodeURIComponent(query)}`)

export const translateToHinglish = (text) =>
  api.post('/api/tts', { text })

export default api
