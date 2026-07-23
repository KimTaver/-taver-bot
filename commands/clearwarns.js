const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "clearwarns",
  description: "Clear all warnings from a member",

  execute(message, args, client) {
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

    if (!client.warnings.has(member.id)) {
      return message.reply("✅ This member has no warnings.");
    }

    client.warnings.delete(member.id);

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("🗑️ Warnings Cleared")
      .setDescription(`All warnings for **${member.user.tag}** have been removed.`)
      .addFields({
        name: "Moderator",
        value: message.author.tag,
        inline: true,
      })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};