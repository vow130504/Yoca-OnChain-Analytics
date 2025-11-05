import { Router } from 'express';
import healthRoute from './health.route';
import usersRoute from './users.route';

const router = Router();

router.use('/health', healthRoute);
router.use('/users', usersRoute);

export default router;
