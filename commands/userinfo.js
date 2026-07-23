const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Shows user information",

  execute(message) {
    const member = message.mentions.members.first() || message.member;
    const user = member.user;

    const embed = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle("👤 User Information")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "Username",
          value: user.tag,
          inline: true,
        },
        {
          name: "User ID",
          value: user.id,
          inline: true,
        },
        {
          name: "Joined Server",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
        },
        {
          name: "Account Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        }
      )
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};