// middleware/checkAuth.js
import axios from 'axios';
import jwt from 'jsonwebtoken'; // Import jwt here

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // No need for promisify
    const userId = decodedToken.userId;

    const userResponse = await axios.get(`/api/db/users/${userId}`);
    const user = userResponse.data;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default checkAuth; // This is allowed for default exports
