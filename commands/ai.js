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
        model: "gemini-2.0-flash-lite",
        contents: prompt,
      });

      return message.reply(response.text);
    } catch (err) {
  console.error(err);

  if (err.message.includes("429")) {
    return message.reply(
      "⚠️ Taver AI is busy right now because the AI quota has been reached. Please try again in a few minutes."
    );
  }

  if (err.message.includes("404")) {
    return message.reply(
      "⚠️ The AI model is currently unavailable. The bot owner needs to update the AI model."
    );
  }

  return message.reply(
    "❌ An unexpected error occurred while contacting Taver AI."
  );
}
      return message.reply(`❌ ${err.message}`);
    }
  },
};