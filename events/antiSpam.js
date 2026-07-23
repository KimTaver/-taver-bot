const spamMap = new Map();

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const userId = message.author.id;
    const now = Date.now();

    if (!spamMap.has(userId)) {
      spamMap.set(userId, {
        count: 1,
        lastMessage: now,
        warned: false,
      });
      return;
    }

    const data = spamMap.get(userId);

    if (now - data.lastMessage <= 3000) {
      data.count++;
      data.lastMessage = now;

      if (data.count === 3 && !data.warned) {
        data.warned = true;
        return message.reply(
          "⚠️ Please stop spamming or you'll be timed out."
        );
      }

      if (data.count >= 5) {
        try {
          await message.member.timeout(
            5 * 60 * 1000,
            "Spamming"
          );

          await message.channel.send(
            `🚫 ${message.author} was timed out for **5 minutes** for spamming.`
          );
        } catch (err) {
          console.error(err);
        }

        spamMap.delete(userId);
      }
    } else {
      spamMap.set(userId, {
        count: 1,
        lastMessage: now,
        warned: false,
      });
    }
  });
};