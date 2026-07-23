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
      });
      return;
    }

    const data = spamMap.get(userId);

    if (now - data.lastMessage < 3000) {
      data.count++;
      data.lastMessage = now;

      if (data.count >= 5) {
        try {
          await message.member.timeout(
            5 * 60 * 1000,
            "Spam detected"
          );

          await message.channel.send(
            `⚠️ ${message.author} has been timed out for **5 minutes** due to spam.`
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
      });
    }
  });
};