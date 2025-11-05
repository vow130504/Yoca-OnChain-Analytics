import { Request, Response } from 'express';
import * as usersService from '../services/users.service';

export async function list(req: Request, res: Response): Promise<void> {
  const users = await usersService.list();
  res.json(users);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const user = await usersService.getById(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
}

export async function create(req: Request, res: Response): Promise<void> {
  const user = await usersService.create(req.body);
  res.status(201).json(user);
}

export async function update(req: Request, res: Response): Promise<void> {
  const user = await usersService.update(req.params.id, req.body);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const ok = await usersService.remove(req.params.id);
  if (!ok) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(204).send();
}
