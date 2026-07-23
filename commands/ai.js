const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = {
  name: "ai",
  description: "Chat with Taver AI",

  async execute(message, args) {
    if (!args.length) {
      return message.reply("❌ Please ask me something.");
    }

    const prompt = args.join(" ");

    try {
      await message.channel.sendTyping();

      const chat = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are Taver, a friendly and helpful Discord moderation assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return message.reply(chat.choices[0].message.content);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Taver AI is currently unavailable.");
    }
  },
};