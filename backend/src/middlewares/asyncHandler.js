/**
 * Wrap async route handlers to forward errors to next()
 * @param {(req:any,res:any,next:any)=>Promise<any>|any} fn
 *
 * Cách dùng (ví dụ):
 *   const express = require('express');
 *   const asyncHandler = require('./middlewares/asyncHandler');
 *   const router = express.Router();
 *
 *   router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await service.getUsers();
 *     res.json(users);
 *   }));
 *
 *   router.post('/users', asyncHandler(async (req, res) => {
 *     const user = await service.createUser(req.body);
 *     res.status(201).json(user);
 *   }));
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
