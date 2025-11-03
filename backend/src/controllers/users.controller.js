const usersService = require('../services/users.service');

exports.list = async (req, res) => {
  const users = await usersService.list();
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await usersService.getById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.create = async (req, res) => {
  const user = await usersService.create(req.body);
  res.status(201).json(user);
};

exports.update = async (req, res) => {
  const user = await usersService.update(req.params.id, req.body);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.remove = async (req, res) => {
  const ok = await usersService.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
};
