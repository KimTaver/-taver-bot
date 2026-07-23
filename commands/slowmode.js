const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "slowmode",
  description: "Set channel slowmode",

  async execute(message, args) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      return message.reply("❌ You don't have permission.");
    }

    const seconds = parseInt(args[0]);

    if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
      return message.reply(
        "❌ Enter a number between **0** and **21600** seconds."
      );
    }

    try {
      await message.channel.setRateLimitPerUser(seconds);

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🐢 Slowmode Updated")
        .setDescription(
          `Slowmode has been set to **${seconds}** second(s).`
        )
        .addFields({
          name: "Moderator",
          value: message.author.tag,
          inline: true,
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to update slowmode.");
    }
  },
};