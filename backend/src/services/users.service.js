let users = [];
let idCounter = 1;

exports.list = async () => users;

exports.getById = async (id) => users.find((u) => u.id === String(id));

exports.create = async (data) => {
  const user = {
    id: String(idCounter++),
    name: data?.name || 'Unnamed',
    email: data?.email || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(user);
  return user;
};

exports.update = async (id, data) => {
  const idx = users.findIndex((u) => u.id === String(id));
  if (idx === -1) return null;
  users[idx] = {
    ...users[idx],
    name: data?.name ?? users[idx].name,
    email: data?.email ?? users[idx].email,
    updatedAt: new Date().toISOString()
  };
  return users[idx];
};

exports.remove = async (id) => {
  const idx = users.findIndex((u) => u.id === String(id));
  if (idx === -1) return false;
  users.splice(idx, 1);
  return true;
};
