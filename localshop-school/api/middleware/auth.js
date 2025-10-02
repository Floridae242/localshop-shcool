// Authentication Middleware
function requireAdmin(req, res, next) {
  const pass = req.headers['x-admin-pass'] || req.query.admin;
  if (pass === process.env.ADMIN_PASS) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = {
  requireAdmin
};

