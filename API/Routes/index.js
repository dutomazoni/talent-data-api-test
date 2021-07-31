import user_routes from './user.routes';
import product_routes from './products.routes';
import { Router } from 'express';

const router = Router();

router.use(user_routes);
router.use(product_routes);

export default router;
