import { user_routes } from '../Controllers';
import { Router } from 'express';

let router = Router();

router.post(
    '/login',
    user_routes.login,
);

export default router;
