import express_jwt from 'express-jwt';
let secret = process.env.JWT || 'testSecret';

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        express_jwt({ secret: secret, algorithms: ['HS256'] }),
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(401).json({
                    message: 'You have no authorization to access this.',
                    errors: ['No sufficient permission.'],
                    statusCode: 401
                });
            }
            next();
        }
    ];
}

export default authorize;
