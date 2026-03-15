const { HfInference } = require('@huggingface/inference');
const env = require('../../config/env');
const pool = require('../../config/db');

const hf = new HfInference(env.hf.token || 'placeholder');
const HF_MODEL = env.hf.model;

exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({ error: { message: 'Message is required' } });
    }

    if (!env.hf.token) {
      return res.status(503).json({ 
        error: { message: 'AI service is currently not configured. Please add HF_TOKEN to .env' } 
      });
    }

    // Optional: Get user enrollment context for personalized learning
    let context = 'The user is a student on the LearnFlow LMS platform.';
    if (userId) {
      try {
        const [enrollments] = await pool.query(
          'SELECT s.title FROM enrollments e JOIN subjects s ON e.subject_id = s.id WHERE e.user_id = ?',
          [userId]
        );
        if (enrollments.length > 0) {
          const subjects = enrollments.map(e => e.title).join(', ');
          context += ` They are currently enrolled in: ${subjects}. Prioritize help related to these topics if relevant.`;
        }
      } catch (dbError) {
        console.error('Database context error:', dbError.message);
        // Continue without extra context if DB fails
      }
    }

    const systemPrompt = `You are a helpful, encouraging, and highly clear educational learning assistant for the LearnFlow LMS platform. 
${context}
Your goal is to:
- Answer learning-related questions clearly and concisely.
- Explain complex concepts simply (like ELI5 where appropriate).
- Help with course topics, assignments, and practice questions.
- Maintain a stable and professional educational tone.

If the user asks about something outside of education or the LMS, politely steer them back to learning.`;

    const response = await hf.chatCompletion({
      model: HF_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content;
    res.json({ response: aiMessage });
  } catch (error) {
    console.error('Hugging Face AI Error:', error.message);
    
    // Check for common HF API errors
    const statusCode = error.status || 500;
    const errorMessage = statusCode === 401 
      ? 'Invalid AI token. Please check the backend configuration.'
      : 'The AI assistant is having trouble thinking right now. Please try again later.';

    res.status(statusCode).json({ 
      error: { message: errorMessage } 
    });
  }
};
