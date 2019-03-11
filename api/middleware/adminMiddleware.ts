import { Request, Response, NextFunction } from 'express';

const { ADMIN_PASSWORD } = process.env;

// middleware for doing admin permissions
export default () => (req: Request , res: Response, next: NextFunction) => {
    // Only on production
    if (!ADMIN_PASSWORD || req.headers.admin_password === ADMIN_PASSWORD) {
        next();
        return;
    }

    res.status(403).json({ message: 'Forbidden Operation' });
};
