const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return message.reply(response.text);
    } catch (err) {
      console.error(err);
      return message.reply("❌ AI is unavailable right now.");
    }
  },
};