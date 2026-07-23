module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    if (message.member.permissions.has("ManageMessages")) return;

    const links = [
      "discord.gg/",
      "discord.com/invite/",
      "http://",
      "https://",
      "www."
    ];

    if (links.some(link => message.content.toLowerCase().includes(link))) {
      try {
        await message.delete();

        await message.channel.send({
          content: `⚠️ ${message.author}, sending links is not allowed.`
        }).then(msg => {
          setTimeout(() => msg.delete().catch(() => {}), 5000);
        });

      } catch (err) {
        console.error(err);
      }
    }
  });
};