const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "announce",
  description: "Send a server announcement",

  async execute(message, args) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageGuild
      )
    ) {
      return message.reply("❌ You don't have permission.");
    }

    const announcement = args.join(" ");

    if (!announcement) {
      return message.reply("❌ Please provide an announcement.");
    }

    await message.delete().catch(() => {});

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📢 Server Announcement")
      .setDescription(announcement)
      .setFooter({
        text: `Announced by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    return message.channel.send({
      embeds: [embed],
    });
  },
};