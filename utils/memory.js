const Memory = require("../models/Memory");

async function saveMemory(userId, username, text) {
  let user = await Memory.findOne({ userId });

  if (!user) {
    user = new Memory({
      userId,
      username,
      memories: [],
    });
  }

  user.memories.push({
    text,
  });

  await user.save();
}

async function getMemories(userId) {
  const user = await Memory.findOne({ userId });

  if (!user) return [];

  return user.memories.map(m => m.text);
}

module.exports = {
  saveMemory,
  getMemories,
};