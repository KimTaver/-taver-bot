module.exports = {
  name: "ping",
  description: "Shows the bot latency",

  execute(message, args, client) {
    message.reply(`🏓 Pong! **${client.ws.ping}ms**`);
  },
};