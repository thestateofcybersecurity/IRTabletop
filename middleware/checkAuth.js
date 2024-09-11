export default function checkAuth(req, res, next) {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}
