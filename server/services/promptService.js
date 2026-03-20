const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a structured course outline from a topic prompt.
 */
const generateCourseOutline = async (topic) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert curriculum designer. Generate a comprehensive online course for the following topic: "${topic}"

Return ONLY a valid JSON object (no markdown, no backticks, no explanation) in this exact format:
{
  "title": "Course Title",
  "description": "A detailed 2-3 sentence course description covering what students will learn",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "modules": [
    {
      "title": "Module 1: Title",
      "lessons": [
        "Lesson Title 1",
        "Lesson Title 2",
        "Lesson Title 3"
      ]
    }
  ]
}

Rules:
- Generate exactly 4-5 modules
- Each module must have exactly 3-4 lessons
- Progress logically from beginner to advanced concepts
- Make titles specific and descriptive
- Tags should be relevant keywords
- Return raw JSON only`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  
  // Strip markdown backticks if present
  const cleaned = text.replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim();
  
  return JSON.parse(cleaned);
};

/**
 * Generate detailed lesson content from course/module/lesson context.
 */
const generateLessonContent = async (courseTitle, moduleTitle, lessonTitle) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert educator. Create detailed lesson content for:
Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

Return ONLY a valid JSON object (no markdown, no backticks, no explanation) in this exact format:
{
  "title": "${lessonTitle}",
  "objectives": [
    "Understand ...",
    "Identify ...",
    "Apply ..."
  ],
  "content": [
    { "type": "heading", "text": "Introduction" },
    { "type": "paragraph", "text": "Detailed explanation paragraph..." },
    { "type": "heading", "text": "Core Concepts" },
    { "type": "paragraph", "text": "More detailed content..." },
    { "type": "code", "language": "python", "text": "# Example code here\nprint('Hello World')" },
    { "type": "heading", "text": "Key Takeaways" },
    { "type": "paragraph", "text": "Summary of what was covered..." },
    { "type": "video", "query": "relevant youtube search query for this lesson" },
    { "type": "mcq", "question": "Question 1?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": 0, "explanation": "Explanation of why this is correct" },
    { "type": "mcq", "question": "Question 2?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": 1, "explanation": "Explanation" },
    { "type": "mcq", "question": "Question 3?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": 2, "explanation": "Explanation" },
    { "type": "mcq", "question": "Question 4?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": 0, "explanation": "Explanation" }
  ]
}

Rules:
- objectives: exactly 3-4 learning objectives
- content: must include at least 3 headings, 3 paragraphs, 1 code block (if relevant), 1 video block, and 4 MCQs at the end
- Paragraphs should be substantial (3-5 sentences each)
- Code blocks: only include if the lesson involves programming; set language appropriately
- video query: a specific YouTube search string (e.g., "Python list comprehension tutorial")
- MCQ answer: 0-indexed integer corresponding to the correct option
- Return raw JSON only`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim();
  
  return JSON.parse(cleaned);
};

/**
 * Translate text to Hinglish using Gemini.
 */
const translateToHinglish = async (text) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Translate the following educational English text into Hinglish (a natural mix of Hindi and English commonly spoken in India). Keep technical terms in English. Make it conversational and easy to understand for students with partial English fluency.

Text to translate:
"${text}"

Return only the translated Hinglish text, no explanation.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

module.exports = { generateCourseOutline, generateLessonContent, translateToHinglish };
