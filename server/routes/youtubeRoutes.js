const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * GET /api/youtube?query=...
 * Proxy YouTube Data API v3 search to avoid exposing key on frontend.
 */
router.get('/youtube', async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'query parameter is required' });

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_YOUTUBE_DATA_API_KEY') {
      // Return a fallback search URL if no key
      return res.json({
        success: true,
        videoId: null,
        embedUrl: null,
        searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        fallback: true,
      });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: apiKey,
        q: query,
        part: 'snippet',
        maxResults: 1,
        type: 'video',
        videoEmbeddable: 'true',
        relevanceLanguage: 'en',
        safeSearch: 'strict',
      },
    });

    const items = response.data.items;
    if (!items || items.length === 0) {
      return res.json({ success: true, videoId: null, fallback: true });
    }

    const videoId = items[0].id.videoId;
    res.json({
      success: true,
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      title: items[0].snippet.title,
      thumbnail: items[0].snippet.thumbnails?.high?.url,
      fallback: false,
    });
  } catch (error) {
    console.error('YouTube API error:', error.message);
    // Graceful fallback
    res.json({
      success: true,
      videoId: null,
      fallback: true,
      searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(req.query.query || '')}`,
    });
  }
});

module.exports = router;
