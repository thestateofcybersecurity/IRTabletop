import jwt from 'jsonwebtoken';
import { findUserById } from '../../lib/db/users'; // Adjust path as needed

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database to ensure token is still valid
    const user = await findUserById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user; // Add user object to the request
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default checkAuth;
