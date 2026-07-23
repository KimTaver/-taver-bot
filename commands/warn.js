const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "warn",
  description: "Warn a member",

  async execute(message, args, client) {
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

    const reason = args.slice(1).join(" ") || "No reason provided.";

    if (!client.warnings.has(member.id)) {
      client.warnings.set(member.id, []);
    }

    client.warnings.get(member.id).push({
      moderator: message.author.tag,
      reason,
      date: new Date().toLocaleString(),
    });

    await member.send(
      `⚠️ You have been warned in **${message.guild.name}**.\nReason: ${reason}`
    ).catch(() => {});

    // Send log to the log channel
    if (client.logChannel) {
      const logChannel = message.guild.channels.cache.get(client.logChannel);

      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0xFEE75C)
          .setTitle("⚠️ Member Warned")
          .addFields(
            {
              name: "Member",
              value: member.user.tag,
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

        logChannel.send({ embeds: [logEmbed] });
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle("⚠️ Member Warned")
      .setDescription(`${member.user.tag} has been warned.`)
      .addFields(
        {
          name: "Reason",
          value: reason,
        },
        {
          name: "Total Warnings",
          value: `${client.warnings.get(member.id).length}`,
          inline: true,
        }
      )
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};