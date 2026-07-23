const { recall } = require("../utils/memory");

module.exports = {
  name: "memory",

  async execute(message, args) {

    const key = args[0];

    if (!key) {
      return message.reply(
        "Usage: !memory <thing>"
      );
    }

    const value = recall(
      message.author.id,
      key
    );

    if (!value) {
      return message.reply(
        "I don't remember anything about that."
      );
    }

    message.reply(
      `🧠 ${key}: ${value}`
    );
  },
};