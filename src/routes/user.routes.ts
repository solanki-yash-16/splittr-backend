import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getAllUsers } from '../controllers/user.controller';

const router = Router();

router.use(authenticate as any);

router.get('/', getAllUsers as any);

export default router;
