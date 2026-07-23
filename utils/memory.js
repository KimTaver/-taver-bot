const fs = require("fs");
const path = require("path");

const memoryFile = path.join(__dirname, "../memory.json");

function loadMemory() {
  if (!fs.existsSync(memoryFile)) {
    fs.writeFileSync(memoryFile, "{}");
  }

  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(data) {
  fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));
}

function remember(userId, key, value) {
  const data = loadMemory();

  if (!data[userId]) {
    data[userId] = {};
  }

  data[userId][key] = value;

  saveMemory(data);
}

function recall(userId, key) {
  const data = loadMemory();

  if (!data[userId]) return null;

  return data[userId][key];
}

function forget(userId, key) {
  const data = loadMemory();

  if (!data[userId]) return;

  delete data[userId][key];

  saveMemory(data);
}

module.exports = {
  remember,
  recall,
  forget,
};