const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "unlock",
  description: "Unlock the current channel",

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
          SendMessages: null,
        }
      );

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("🔓 Channel Unlocked")
        .setDescription(`${message.channel} has been unlocked.`)
        .addFields({
          name: "Moderator",
          value: message.author.tag,
          inline: true,
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to unlock the channel.");
    }
  },
};