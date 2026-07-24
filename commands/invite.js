const { EmbedBuilder } = require("discord.js");

const CLIENT_ID = "1529444189610315886";

module.exports = {
  name: "invite",
  description: "Get the Taver AI invite link",

  async execute(message) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("📨 Invite Taver AI")
      .setDescription(
        `Want Taver AI in your own server?\n\n**[Click here to invite Taver AI](${inviteLink})**`
      )
      .setFooter({ text: "Created by Kim_Taver" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};