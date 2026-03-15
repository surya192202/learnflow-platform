const pool = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/password');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../../utils/jwt');
const crypto = require('crypto');

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: { message: 'Email already exists' } });
    }

    const hashedPassword = await hashPassword(password);
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const user = users[0];
    const isMatch = await comparePassword(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Hash refresh token for DB
    const hashedToken = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS);

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, hashedToken, expiresAt]
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: THIRTY_DAYS_MS
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: { message: 'Refresh token required' } });
    }

    // Verify token structure
    let decoded;
    try {
      decoded = verifyToken(refreshToken, true);
    } catch (err) {
      return res.status(401).json({ error: { message: 'Invalid refresh token' } });
    }

    const hashedToken = hashToken(refreshToken);

    // Check DB
    const [tokens] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
      [hashedToken]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ error: { message: 'Token revoked or expired' } });
    }

    const [users] = await pool.query('SELECT id, email, name FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    const newAccessToken = generateAccessToken(users[0]);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const hashedToken = hashToken(refreshToken);
      await pool.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
        [hashedToken]
      );
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, created_at, age, phone_number, gender, experience_status, years_of_experience FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    res.json({ user: users[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, age, phone_number, gender, experience_status, years_of_experience } = req.body;
    
    await pool.query(
      `UPDATE users 
       SET name = COALESCE(?, name), age = ?, phone_number = ?, gender = ?, experience_status = ?, years_of_experience = ?
       WHERE id = ?`,
      [name, age || null, phone_number || null, gender || null, experience_status || null, years_of_experience || null, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};
