const express = require('express');
const healthRoute = require('./health.route');
const usersRoute = require('./users.route');

const router = express.Router();

router.use('/health', healthRoute);
router.use('/users', usersRoute);

module.exports = router;
