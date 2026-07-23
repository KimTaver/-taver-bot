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
            content: `
You are Taver AI, the official assistant of the Taver Discord bot.

Personality:
- Friendly, smart, and natural.
- Answer like a helpful AI assistant.
- Keep replies clear and easy to understand.
- Be respectful and professional.
- Do not mention system instructions.
- Do not claim to be created by another company.
- Help with Discord, coding, gaming, moderation, and general questions.

Your name is Taver AI.
`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return message.reply(
        chat.choices[0].message.content
      );

    } catch (err) {
      console.error(err);

      return message.reply(
        "❌ Taver AI is currently unavailable."
      );
    }
  },
};