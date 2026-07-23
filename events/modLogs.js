const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  client.on("guildMemberRemove", async (member) => {
    const channel = member.guild.channels.cache.find(
      c => c.name === "mod-logs"
    );

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("👢 Member Left")
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        {
          name: "User",
          value: `${member.user.tag}`,
          inline: true,
        },
        {
          name: "User ID",
          value: member.id,
          inline: true,
        }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] });
  });

  client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.find(
      c => c.name === "mod-logs"
    );

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("📥 Member Joined")
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        {
          name: "User",
          value: `${member.user.tag}`,
          inline: true,
        },
        {
          name: "Account Created",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
          inline: true,
        }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] });
  });
};