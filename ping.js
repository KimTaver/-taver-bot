const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  name: "ping",

  async execute(client, message) {
    const embed = new EmbedBuilder()
      .setColor(config.successColor)
      .setTitle("🏓 Pong!")
      .setDescription(`Latency: **${client.ws.ping}ms**`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};