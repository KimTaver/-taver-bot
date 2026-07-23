const {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
  Partials,
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const getAIResponse = require("./utils/ai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
  ],
});

client.commands = new Collection();
client.warnings = new Map();

const prefix = "!";

// Load Commands
const commandPath = path.join(__dirname, "commands");

if (fs.existsSync(commandPath)) {
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
  }
}

// Load Events
const eventPath = path.join(__dirname, "events");

if (fs.existsSync(eventPath)) {
  const eventFiles = fs
    .readdirSync(eventPath)
    .filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    event(client);
    console.log(`✅ Loaded event: ${file}`);
  }
}

client.once("ready", () => {
  console.clear();
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.user.setActivity("!help | Taver AI", {
    type: ActivityType.Playing,
  });
});


client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // Reply to DMs with AI
if (!message.guild) {
  if (message.author.bot) return;

  try {
    await message.channel.sendTyping();

    const response = await getAIResponse(message.content);

    return message.reply(response);
  } catch (err) {
    console.error(err);
    return message.reply("⚠️ Taver AI is having trouble right now.");
  }
}


  // 🤖 Taver AI Mention System
  if (message.mentions.has(client.user)) {

    const prompt = message.content
      .replace(`<@${client.user.id}>`, "")
      .trim();

    if (!prompt) {
      return message.reply(
        "🤖 I'm Taver AI. Created by Kim_Taver. Ask me about Discord, coding, gaming, moderation, or anything else."
      );
    }

    try {
      await message.channel.sendTyping();

      const response = await getAIResponse(prompt);

      return message.reply(response);

    } catch (error) {
      console.error("AI Error:", error);

      return message.reply(
        "⚠️ Taver AI is having trouble connecting right now."
      );
    }
  }


  // Prefix Commands
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

    message.reply(
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