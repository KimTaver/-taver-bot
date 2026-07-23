const {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
  Partials,
  EmbedBuilder,
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
  partials: [
    Partials.Message,
    Partials.Channel,
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

  const logChannel = message.guild.channels.cache.get(client.logChannel);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("🗑️ Message Deleted")
    .addFields(
      {
        name: "👤 Author",
        value: message.author ? message.author.tag : "Unknown",
        inline: true,
      },
      {
        name: "📍 Channel",
        value: `${message.channel}`,
        inline: true,
      },
      {
        name: "📝 Content",
        value: message.content || "*No content*",
      }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(console.error);
});

// Message Edit Logs
client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (!newMessage.guild) return;
  if (!client.logChannel) return;

  const logChannel = newMessage.guild.channels.cache.get(client.logChannel);
  if (!logChannel) return;

  if (newMessage.author?.bot) return;

  if (oldMessage.content === newMessage.content) return;

  const embed = new EmbedBuilder()
    .setColor(0xFAA61A)
    .setTitle("✏️ Message Edited")
    .addFields(
      {
        name: "👤 Author",
        value: newMessage.author ? newMessage.author.tag : "Unknown",
        inline: true,
      },
      {
        name: "📍 Channel",
        value: `${newMessage.channel}`,
        inline: true,
      },
      {
        name: "📝 Before",
        value: oldMessage.content || "*No content*",
      },
      {
        name: "✏️ After",
        value: newMessage.content || "*No content*",
      }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(console.error);
});
// Member Join Log
client.on("guildMemberAdd", async (member) => {
  if (!client.logChannel) return;

  const logChannel = member.guild.channels.cache.get(client.logChannel);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle("👋 Member Joined")
    .setThumbnail(member.user.displayAvatarURL())
    .addFields(
      {
        name: "Member",
        value: `${member.user.tag}`,
        inline: true,
      },
      {
        name: "Account Created",
        value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        inline: true,
      }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(console.error);
});

// Member Leave Log
client.on("guildMemberRemove", async (member) => {
  if (!client.logChannel) return;

  const logChannel = member.guild.channels.cache.get(client.logChannel);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("🚪 Member Left")
    .setThumbnail(member.user.displayAvatarURL())
    .addFields({
      name: "Member",
      value: `${member.user.tag}`,
      inline: true,
    })
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(console.error);
});
client.login(process.env.DISCORD_TOKEN);