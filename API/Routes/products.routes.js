import { product_routes } from '../Controllers';
import { Router } from 'express';
import * as yup from 'yup';
import validate from "../Middleware/validate";
import auth from '../Middleware/authentication';

let router = Router();

router.get(
    '/products/:organizationName',
    auth(['junior', 'middle', 'senior', 'intern']),
    validate({
        shape: {
            tags: yup.lazy((value) => (Array.isArray(value) ? yup.array().of(yup.string()) : yup.string())),
        },
        path: 'query',
        isAuthEndpoint: true
    }),
    product_routes.product_by_organization,
);


export default router;
