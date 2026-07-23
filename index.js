client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ==========================
  // DM AI
  // ==========================
  if (!message.guild) {
    try {
      console.log("📩 DM received:", message.content);

      await message.channel.sendTyping();

      const response = await getAIResponse(message.content);

      console.log("🤖 AI replied:", response);

      return message.channel.send(response);

    } catch (err) {
      console.error("❌ DM Error:", err);

      return message.channel.send(
        "⚠️ Taver AI is having trouble right now."
      );
    }
  }

  // ==========================
  // Mention AI
  // ==========================
  if (message.mentions.has(client.user)) {

    const prompt = message.content
      .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
      .trim();

    if (!prompt) {
      return message.reply(
        "🤖 I'm Taver AI. Created by Kim_Taver. Ask me about Discord, coding, gaming, moderation, or anything."
      );
    }

    try {
      await message.channel.sendTyping();

      const response = await getAIResponse(prompt);

      return message.reply(response);

    } catch (err) {
      console.error("AI Error:", err);

      return message.reply(
        "⚠️ Taver AI is having trouble connecting right now."
      );
    }
  }

  // ==========================
  // Prefix Commands
  // ==========================
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args, client);

  } catch (err) {
    console.error(err);

    return message.reply(
      "❌ An error occurred while executing that command."
    );
  }
});
client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log("✅ Discord login successful");
  })
  .catch((err) => {
    console.error("❌ Discord login failed:");
    console.error(err);
  });