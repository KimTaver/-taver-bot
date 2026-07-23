const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Shows server information",

  execute(message) {
    const guild = message.guild;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📊 Server Information")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: "🏷️ Server Name",
          value: guild.name,
          inline: true,
        },
        {
          name: "👥 Members",
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: "👑 Owner",
          value: `<@${guild.ownerId}>`,
          inline: true,
        },
        {
          name: "🆔 Server ID",
          value: guild.id,
        },
        {
          name: "📅 Created",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
        }
      )
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};