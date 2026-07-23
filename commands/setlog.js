module.exports = {
  name: "setlog",
  description: "Set the server log channel",

  execute(message, args, client) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You must be an Administrator.");
    }

    const channel = message.mentions.channels.first();

    if (!channel) {
      return message.reply("❌ Mention a channel.");
    }

    client.logChannel = channel.id;

    return message.reply(`✅ Log channel set to ${channel}.`);
  },
};