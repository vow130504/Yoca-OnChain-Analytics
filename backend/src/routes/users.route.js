const express = require('express');
const usersController = require('../controllers/users.controller');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(usersController.list));
router.get('/:id', asyncHandler(usersController.getById));
router.post('/', asyncHandler(usersController.create));
router.put('/:id', asyncHandler(usersController.update));
router.delete('/:id', asyncHandler(usersController.remove));

module.exports = router;
