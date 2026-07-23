const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Shows user information",

  execute(message) {
    const user = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle("👤 User Information")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "Username",
          value: user.tag,
          inline: true,
        },
        {
          name: "User ID",
          value: user.id,
          inline: true,
        },
        {
          name: "Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        }
      )
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};