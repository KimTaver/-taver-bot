const { remember } = require("../utils/memory");

module.exports = {
  name: "remember",

  async execute(message, args) {

    const key = args[0];
    const value = args.slice(1).join(" ");

    if (!key || !value) {
      return message.reply(
        "Usage: !remember <thing> <value>"
      );
    }

    remember(
      message.author.id,
      key,
      value
    );

    message.reply(
      `🧠 Got it. I'll remember your ${key}.`
    );
  },
};