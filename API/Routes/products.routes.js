import { product_routes } from '../Controllers';
import { Router } from 'express';
import auth from '../Middleware/authentication';

let router = Router();

router.get(
    '/products/:organizationName',
    auth(['junior', 'middle', 'senior', 'intern']),
    product_routes.product_by_organization,
);


export default router;
