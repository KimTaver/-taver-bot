const fs = require("fs");
const path = require("path");

const levelsFile = path.join(__dirname, "../data/levels.json");

let levels = {};

if (fs.existsSync(levelsFile)) {
  levels = JSON.parse(fs.readFileSync(levelsFile, "utf8"));
}

const cooldown = new Map();

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const userId = message.author.id;

    if (cooldown.has(userId)) return;
    cooldown.set(userId, true);

    setTimeout(() => cooldown.delete(userId), 10000);

    if (!levels[userId]) {
      levels[userId] = {
        xp: 0,
        level: 1,
      };
    }

    const xp = Math.floor(Math.random() * 11) + 5;
    levels[userId].xp += xp;

    const neededXP = levels[userId].level * 100;

    if (levels[userId].xp >= neededXP) {
      levels[userId].xp -= neededXP;
      levels[userId].level++;

      message.channel.send(
        `🎉 Congratulations ${message.author}! You reached **Level ${levels[userId].level}**!`
      );
    }

    fs.writeFileSync(levelsFile, JSON.stringify(levels, null, 2));
  });
};