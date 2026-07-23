const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "timeout",
  description: "Timeout a member",

  async execute(message, args) {
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

    if (!member.moderatable) {
      return message.reply("❌ I can't timeout this member.");
    }

    const minutes = parseInt(args[1]);

    if (isNaN(minutes) || minutes <= 0) {
      return message.reply("❌ Enter a valid number of minutes.");
    }

    const reason = args.slice(2).join(" ") || "No reason provided.";

    try {
      await member.send(
        `⏳ You have been timed out in **${message.guild.name}** for **${minutes}** minute(s).\nReason: ${reason}`
      ).catch(() => {});

      await member.timeout(minutes * 60 * 1000, reason);

      const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle("⏳ Member Timed Out")
        .setDescription(`${member.user.tag} has been timed out.`)
        .addFields(
          {
            name: "Duration",
            value: `${minutes} minute(s)`,
            inline: true,
          },
          {
            name: "Moderator",
            value: message.author.tag,
            inline: true,
          },
          {
            name: "Reason",
            value: reason,
          }
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to timeout member.");
    }
  },
};