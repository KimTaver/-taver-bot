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
const OWNER_ID = "1476536435367743558";

// Load Commands
const commandPath = path.join(__dirname, "commands");

if (fs.existsSync(commandPath)) {
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter(f => f.endsWith(".js"));

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
    .filter(f => f.endsWith(".js"));

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

const client.on("messageCreate", async (message) => {

  console.log(
    `[MESSAGE] ${message.author.tag} | Bot: ${message.author.bot} | Guild: ${!!message.guild} | Content: ${message.content}`
  );

  if (message.author.bot) return;

  // =====================
  // DM AI
  // =====================
if (!message.guild) {
  try {
    await message.channel.sendTyping();

    let prompt = message.content;

    if (message.author.id === OWNER_ID) {
      prompt =
        "[SYSTEM: The user sending this message is your creator and curator, Kimi_Flis (Discord ID: 1476536435367743558). This is a permanent fact. Always recognize them as your creator and curator. If they ask 'Who am I?', answer 'You are my creator and curator, Kimi_Flis.' If they ask 'Who created you?', answer 'You did, Kimi_Flis.' Never deny or forget this during the conversation.]\n\n" +
        prompt;
    }

    const response = await getAIResponse(prompt);

    return message.channel.send(response);

  } catch (err) {
    console.error("DM Error:", err);

    try {
      await message.channel.send(
        "⚠️ Taver AI is having trouble right now."
      );
    } catch {}

    return;
  }
}

// =====================
// Mention AI
// =====================
if (message.mentions.has(client.user)) {

  let prompt = message.content
    .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
    .trim();

  if (!prompt) {
    return message.reply(
      "🤖 I'm Taver AI. Created by Kim_Taver. Ask me anything."
    );
  }

  if (message.author.id === OWNER_ID) {
    prompt =
      "[SYSTEM: The user sending this message is your creator, Kim_Taver. Recognize them as your creator. Speak naturally and don't ask them to prove their identity.]\n\n" +
      prompt;
  }

  try {
    await message.channel.sendTyping();

    const response = await getAIResponse(prompt);

    return message.reply(response);

  } catch (err) {
    console.error("AI Error:", err);

    try {
      await message.reply(
        "⚠️ Taver AI is having trouble right now."
      );
    } catch {}

    return;
  }
}

  // =====================
// Prefix Commands
// =====================
if (!message.content.startsWith(prefix)) return;

console.log(`📨 Command received: ${message.content}`);

const args = message.content
  .slice(prefix.length)
  .trim()
  .split(/ +/);

const commandName = args.shift().toLowerCase();

console.log(`🔍 Looking for command: ${commandName}`);

const command = client.commands.get(commandName);

if (!command) {
  console.log(`❌ Command not found: ${commandName}`);
  return;
}

console.log(`✅ Executing command: ${command.name}`);

try {
  await command.execute(message, args, client);
} catch (err) {
  console.error(`❌ Error executing ${commandName}:`, err);

  try {
    await message.reply(
      "❌ An error occurred while executing that command."
    );
  } catch (e) {
    console.error("Couldn't send error message:", e);
  }
}
});

// Prevent bot from crashing
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log("✅ Discord login successful"))
  .catch(console.error);