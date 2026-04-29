import { Router } from 'express';
import { getMenuItem, listMenu } from '../controllers/menu.controller';

const router = Router();

router.get('/', listMenu);
router.get('/:id', getMenuItem);

export default router;
