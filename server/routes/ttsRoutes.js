const express = require('express');
const router = express.Router();
const { translateToHinglish } = require('../services/promptService');

/**
 * POST /api/tts
 * Translates lesson text to Hinglish and returns it as text for TTS playback.
 * Frontend uses Web Speech API for TTS since Gemini TTS requires additional setup.
 */
router.post('/tts', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    // Limit text length to avoid excessive API usage
    const truncated = text.substring(0, 2000);
    
    const hinglishText = await translateToHinglish(truncated);
    res.json({ success: true, hinglishText });
  } catch (error) {
    console.error('TTS error:', error.message);
    next(error);
  }
});

module.exports = router;
