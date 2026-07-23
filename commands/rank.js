const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rank",
  description: "Shows your current level and XP",

  execute(message) {
    const levelsFile = path.join(__dirname, "../data/levels.json");

    if (!fs.existsSync(levelsFile)) {
      return message.reply("❌ No level data found.");
    }

    const levels = JSON.parse(fs.readFileSync(levelsFile, "utf8"));

    const user = message.mentions.users.first() || message.author;

    if (!levels[user.id]) {
      return message.reply("❌ This user has no XP yet.");
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🏆 Rank Card")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: "👤 User",
          value: user.tag,
          inline: true,
        },
        {
          name: "⭐ Level",
          value: `${levels[user.id].level}`,
          inline: true,
        },
        {
          name: "✨ XP",
          value: `${levels[user.id].xp}`,
          inline: true,
        }
      )
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};