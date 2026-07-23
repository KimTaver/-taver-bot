const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leaderboard",
  description: "Shows the server leaderboard",

  async execute(message, args, client) {
    const levelsFile = path.join(__dirname, "../data/levels.json");

    if (!fs.existsSync(levelsFile)) {
      return message.reply("❌ No level data found.");
    }

    const levels = JSON.parse(fs.readFileSync(levelsFile, "utf8"));

    const sorted = Object.entries(levels)
      .sort((a, b) => {
        if (b[1].level === a[1].level) {
          return b[1].xp - a[1].xp;
        }
        return b[1].level - a[1].level;
      })
      .slice(0, 10);

    if (sorted.length === 0) {
      return message.reply("❌ Nobody has earned any XP yet.");
    }

    let description = "";

    for (let i = 0; i < sorted.length; i++) {
      const [id, data] = sorted[i];

      let user;

      try {
        user = await client.users.fetch(id);
      } catch {
        user = { tag: "Unknown User" };
      }

      const medal =
        i === 0 ? "🥇" :
        i === 1 ? "🥈" :
        i === 2 ? "🥉" :
        `**${i + 1}.**`;

      description += `${medal} ${user.tag}\nLevel **${data.level}** • ${data.xp} XP\n\n`;
    }

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle("🏆 Taver Leaderboard")
      .setDescription(description)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};