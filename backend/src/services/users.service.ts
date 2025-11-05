export interface User {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

let users: User[] = [];
let idCounter = 1;

export async function list(): Promise<User[]> {
  return users;
}

export async function getById(id: string | number): Promise<User | undefined> {
  return users.find((u) => u.id === String(id));
}

export interface CreateUserInput {
  name?: string;
  email?: string | null;
}

export async function create(data: CreateUserInput): Promise<User> {
  const now = new Date().toISOString();
  const user: User = {
    id: String(idCounter++),
    name: data?.name || 'Unnamed',
    email: data?.email ?? null,
    createdAt: now,
    updatedAt: now
  };
  users.push(user);
  return user;
}

export interface UpdateUserInput {
  name?: string;
  email?: string | null;
}

export async function update(id: string | number, data: UpdateUserInput): Promise<User | null> {
  const idx = users.findIndex((u) => u.id === String(id));
  if (idx === -1) return null;
  users[idx] = {
    ...users[idx],
    name: data?.name ?? users[idx].name,
    email: data?.email ?? users[idx].email,
    updatedAt: new Date().toISOString()
  };
  return users[idx];
}

export async function remove(id: string | number): Promise<boolean> {
  const idx = users.findIndex((u) => u.id === String(id));
  if (idx === -1) return false;
  users.splice(idx, 1);
  return true;
}
