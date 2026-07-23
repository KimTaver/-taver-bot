const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  aliases: ["avatar", "serverinfo", "botinfo"],

  execute(message, args, client) {
    const command = message.content.slice(1).split(" ")[0].toLowerCase();

    // !userinfo
    if (command === "userinfo") {
      const user = message.mentions.users.first() || message.author;

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle("👤 User Information")
            .setThumbnail(user.displayAvatarURL({ size: 4096 }))
            .addFields(
              { name: "Username", value: user.tag, inline: true },
              { name: "ID", value: user.id, inline: true },
              {
                name: "Created",
                value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
              }
            )
            .setTimestamp(),
        ],
      });
    }

    // !avatar
    if (command === "avatar") {
      const user = message.mentions.users.first() || message.author;

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ size: 4096 }))
            .setTimestamp(),
        ],
      });
    }

    // !serverinfo
    if (command === "serverinfo") {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("📊 Server Information")
            .setThumbnail(message.guild.iconURL())
            .addFields(
              {
                name: "Server",
                value: message.guild.name,
                inline: true,
              },
              {
                name: "Members",
                value: `${message.guild.memberCount}`,
                inline: true,
              },
              {
                name: "Owner",
                value: `<@${message.guild.ownerId}>`,
                inline: true,
              }
            )
            .setTimestamp(),
        ],
      });
    }

    // !botinfo
    if (command === "botinfo") {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("🤖 Taver Moderation")
            .addFields(
              {
                name: "Developer",
                value: "Kim_Taver",
                inline: true,
              },
              {
                name: "Ping",
                value: `${client.ws.ping}ms`,
                inline: true,
              },
              {
                name: "Servers",
                value: `${client.guilds.cache.size}`,
                inline: true,
              }
            )
            .setTimestamp(),
        ],
      });
    }
  },
};