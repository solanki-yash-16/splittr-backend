import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createGroup,
  addExpense,
  getGroupSummary,
  getSettlements,
  getGroupById,
  getUserGroups
} from '../controllers/group.controller';

const router = Router();

router.use(authenticate as any);

router.get('/', getUserGroups as any);
router.post('/', createGroup as any);
router.get('/:id', getGroupById as any);
router.post('/:id/expenses', addExpense as any);
router.get('/:id/summary', getGroupSummary as any);
router.get('/:id/settlements', getSettlements as any);

export default router;
