const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "lock",
  description: "Lock the current channel",

  async execute(message) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      return message.reply("❌ You don't have permission.");
    }

    try {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          SendMessages: false,
        }
      );

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("🔒 Channel Locked")
        .setDescription(`${message.channel} has been locked.`)
        .addFields({
          name: "Moderator",
          value: message.author.tag,
          inline: true,
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to lock the channel.");
    }
  },
};