const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = "!";

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} is online!`);
  client.user.setActivity("!help");
});
function createEmbed(title, description, color) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    return message.reply("🏓 Pong!");
  }

  if (command === "help") {
    return message.reply(`
📖 **Taver Moderation**

**Commands**
🏓 !ping
❓ !help

More commands are coming soon...
    `);
  }
});

client.login(process.env.DISCORD_TOKEN);