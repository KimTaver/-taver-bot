const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Shows all commands",

  execute(message, args, client) {
    const commands = [...client.commands.values()]
      .map(cmd => `\`${cmd.name}\``)
      .sort()
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📖 Taver Moderation")
      .setDescription("**Available Commands**\n\n" + commands)
      .setFooter({
        text: `Total Commands: ${client.commands.size} • Developed by Kim_Taver`,
      })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};