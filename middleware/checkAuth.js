import axios from 'axios';

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Fetch user data from the serverless function
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

export default checkAuth;
