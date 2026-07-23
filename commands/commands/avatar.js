const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Shows a user's avatar",

  execute(message) {
    const user = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 4096 }))
      .setFooter({
        text: `Requested by ${message.author.tag}`,
      })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};