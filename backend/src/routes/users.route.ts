import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import asyncHandler from '../middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(usersController.list));
router.get('/:id', asyncHandler(usersController.getById));
router.post('/', asyncHandler(usersController.create));
router.put('/:id', asyncHandler(usersController.update));
router.delete('/:id', asyncHandler(usersController.remove));

export default router;
