const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getAIResponse(prompt) {

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
You are Taver AI.

Your creator is Kim_Taver.

Personality:
- Confident
- Friendly
- Slightly sarcastic
- Helpful

You help with:
- Discord
- Coding
- Gaming
- Moderation
- General questions

Do not say you are a default AI assistant.
Always act as Taver AI.
`
      },
      {
        role: "user",
        content: prompt
      }
    ],

    model: "llama-3.1-8b-instant"
  });

  return completion.choices[0].message.content;
}

module.exports = getAIResponse;