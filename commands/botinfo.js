const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "botinfo",
  description: "Shows bot information",

  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("🤖 Taver Moderation")
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        {
          name: "🤖 Bot Name",
          value: client.user.username,
          inline: true,
        },
        {
          name: "📡 Ping",
          value: `${client.ws.ping}ms`,
          inline: true,
        },
        {
          name: "🏠 Servers",
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: "👨‍💻 Developer",
          value: "Kim_Taver",
          inline: true,
        },
        {
          name: "📚 Discord.js",
          value: "v14",
          inline: true,
        },
        {
          name: "⚡ Status",
          value: "Online",
          inline: true,
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