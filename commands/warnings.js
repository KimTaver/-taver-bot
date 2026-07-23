const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "warnings",
  description: "View a member's warnings",

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

    const warnings = client.warnings.get(member.id);

    if (!warnings || warnings.length === 0) {
      return message.reply("✅ This member has no warnings.");
    }

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(`⚠️ Warnings for ${member.user.tag}`)
      .setDescription(
        warnings
          .map(
            (warn, index) =>
              `**${index + 1}.** ${warn.reason}\n👮 ${warn.moderator}\n📅 ${warn.date}`
          )
          .join("\n\n")
      )
      .setFooter({
        text: `Total Warnings: ${warnings.length}`,
      })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};