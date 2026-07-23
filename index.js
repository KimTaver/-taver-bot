const {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.warnings = new Map();

const prefix = "!";

// Load commands
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(`Loaded command: ${command.name}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.clear();
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.user.setActivity("!help | Taver Moderation", {
    type: ActivityType.Playing,
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply("❌ An error occurred while executing that command.");
  }
});

// Message Delete Logs
client.on("messageDelete", async (message) => {
  if (!message.guild) return;
  if (!client.logChannel) return;
  if (message.author?.bot) return;

  const logChannel = message.guild.channels.cache.get(client.logChannel);
  if (!logChannel) return;

  const { EmbedBuilder } = require("discord.js");

  const embed = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("🗑️ Message Deleted")
    .addFields(
      {
        name: "👤 Author",
        value: message.author.tag,
        inline: true,
      },
      {
        name: "📍 Channel",
        value: `${message.channel}`,
        inline: true,
      },
      {
        name: "📝 Content",
        value: message.content || "*No text content*",
      }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(() => {});
});

client.login(process.env.DISCORD_TOKEN);