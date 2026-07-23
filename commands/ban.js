const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a member",

  async execute(message, args) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    )
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();

    if (!member)
      return message.reply("❌ Mention a member.");

    if (!member.bannable)
      return message.reply("❌ I can't ban this member.");

    const reason =
      args.slice(1).join(" ") || "No reason provided.";

    try {
      await member.send(
        `🔨 You have been banned from **${message.guild.name}**.\nReason: ${reason}`
      ).catch(() => {});

      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("🔨 Member Banned")
        .setDescription(`${member.user.tag} has been banned.`)
        .addFields(
          {
            name: "Moderator",
            value: message.author.tag,
            inline: true,
          },
          {
            name: "Reason",
            value: reason,
            inline: true,
          }
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to ban member.");
    }
  },
};