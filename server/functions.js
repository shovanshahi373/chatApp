const users = [];

const createUser = ({ name, id, room }) => {
  //logic to check if user already exists
  const index = users.findIndex(user => user.id === id && user.room === room);
  if (index != -1) return { error: "user already exists" };
  users.push({ name, id, room });
  return { user: users[users.length - 1] };
};

const deleteUser = id => {
  const index = users.findIndex(user => user.id === id);
  return users.splice(index, 1)[0];
};

const getUser = id => users.find(user => user.id === id);

module.exports = { createUser, deleteUser, getUser };
