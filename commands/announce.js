const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "announce",
  description: "Send a server announcement",

  async execute(message, args) {

    console.log("📢 Announce command started.");

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageGuild
      )
    ) {
      return message.reply("❌ You don't have permission.");
    }

    const channel =
      message.mentions.channels.first() || message.channel;

    if (message.mentions.channels.first()) {
      args.shift();
    }

    const announcement = args.join(" ");

    if (!announcement) {
      return message.reply(
        "❌ Usage: !announce #channel Your announcement here"
      );
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

    await channel.send({
      embeds: [embed],
    });

    return message.author.send(
      `✅ Announcement sent to ${channel}.`
    ).catch(() => {});
  },
};