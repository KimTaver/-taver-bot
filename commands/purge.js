const {
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "purge",
  description: "Delete multiple messages",

  async execute(message, args) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return message.reply("❌ You don't have permission.");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("❌ Enter a number between 1 and 100.");
    }

    try {
      await message.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("🧹 Messages Deleted")
        .setDescription(`Successfully deleted **${amount}** messages.`)
        .setTimestamp();

      const reply = await message.channel.send({
        embeds: [embed],
      });

      setTimeout(() => {
        reply.delete().catch(() => {});
      }, 5000);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to delete messages.");
    }
  },
};