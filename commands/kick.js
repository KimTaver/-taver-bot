const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a member",

  async execute(message, args) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.KickMembers
      )
    )
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();

    if (!member)
      return message.reply("❌ Mention a member.");

    if (!member.kickable)
      return message.reply("❌ I can't kick this member.");

    const reason =
      args.slice(1).join(" ") || "No reason provided.";

    try {
      await member.send(
        `👢 You have been kicked from **${message.guild.name}**.\nReason: ${reason}`
      ).catch(() => {});

      await member.kick(reason);

      const embed = new EmbedBuilder()
        .setColor(0xFAA61A)
        .setTitle("👢 Member Kicked")
        .setDescription(`${member.user.tag} has been kicked.`)
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
      return message.reply("❌ Failed to kick member.");
    }
  },
};