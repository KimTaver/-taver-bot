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
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
  ],
});

client.commands = new Collection();
client.warnings = new Map();

const prefix = "!";

// Load Commands
const commandPath = path.join(__dirname, "commands");

if (fs.existsSync(commandPath)) {
  const commandFiles = fs.readdirSync(commandPath).filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
  }
}

// Load Events
const eventPath = path.join(__dirname, "events");

if (fs.existsSync(eventPath)) {
  const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    require(`./events/${file}`)(client);
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

  // =====================
  // DM AI
  // =====================
  if (!message.guild) {
    try {
      await message.channel.sendTyping();

      const response = await getAIResponse(message.content);

      return message.channel.send(response);
    } catch (err) {
      console.error("DM Error:", err);

      return message.channel.send(
        "⚠️ Taver AI is having trouble right now."
      );
    }
  }

  // =====================
  // Mention AI
  // =====================
  if (message.mentions.has(client.user)) {

    const prompt = message.content
      .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
      .trim();

    if (!prompt) {
      return message.reply(
        "🤖 I'm Taver AI. Created by Kim_Taver. Ask me anything."
      );
    }

    try {
      await message.channel.sendTyping();

      const response = await getAIResponse(prompt);

      return message.reply(response);

    } catch (err) {
      console.error("AI Error:", err);

      return message.reply(
        "⚠️ Taver AI is having trouble right now."
      );
    }
  }

  // =====================
  // Prefix Commands
  // =====================
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
  .then(() => console.log("✅ Discord login successful"))
  .catch(console.error);