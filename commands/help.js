const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Shows all commands",

  execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📖 Taver Moderation")
      .setDescription("Available Commands")
      .addFields(
        {
          name: "ℹ️ Information",
          value:
            "`!help`\n`!ping`\n`!userinfo`\n`!avatar`\n`!serverinfo`\n`!botinfo`",
        },
        {
          name: "🛡️ Moderation",
          value:
            "`!ban`\n`!kick`\n`!timeout`\n`!untimeout`\n`!warn`\n`!purge`",
        },
        {
          name: "⚙️ Utility",
          value:
            "`!lock`\n`!unlock`\n`!slowmode`\n`!announce`",
        }
      )
      .setFooter({
        text: "Taver Moderation • Developed by Kim_Taver",
      })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};