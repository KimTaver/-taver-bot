module.exports = {
  name: "ping",

  execute(message, client) {
    message.reply(`🏓 Pong! ${client.ws.ping}ms`);
  },
};