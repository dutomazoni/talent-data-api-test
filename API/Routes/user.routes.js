import { user_routes } from '../Controllers';
import { Router } from 'express';
import * as yup from 'yup';
import validate from "../Middleware/validate";

let router = Router();

router.post(
    '/login',
    validate({
        shape: {
            email: yup.string().typeError('You must insert a valid email.').required(),
            password: yup.string().typeError('You must insert a valid password.').required()
        },
        path: 'body',
        isAuthEndpoint: false
    }),
    user_routes.login,
);


export default router;
