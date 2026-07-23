const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "untimeout",
  description: "Remove a member's timeout",

  async execute(message) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    ) {
      return message.reply("❌ You don't have permission.");
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply("❌ Mention a member.");
    }

    try {
      await member.timeout(null);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("✅ Timeout Removed")
        .setDescription(`${member.user.tag}'s timeout has been removed.`)
        .addFields({
          name: "Moderator",
          value: message.author.tag,
          inline: true,
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to remove timeout.");
    }
  },
};