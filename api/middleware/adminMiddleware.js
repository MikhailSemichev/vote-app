const { ADMIN_PASSWORD } = process.env;

// middleware for doing admin permissions
module.exports = () => (req, res, next) => {
    // Only on production
    if (!ADMIN_PASSWORD || req.headers['admin-password'] === ADMIN_PASSWORD) {
        next();
        return;
    }

    res.status(403).json({ message: 'Forbidden Operation' });
};
