const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = "!";

client.once("ready", () => {
  console.clear();
  console.log(`✅ ${client.user.tag} is online!`);

  client.user.setActivity("!help | Taver Moderation", {
    type: ActivityType.Playing,
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  function embed(title, description, color) {
    return new EmbedBuilder()
      .setColor(color)
      .setAuthor({
        name: "Taver Moderation",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();
  }

  // !ping
if (command === "ping") {
  return message.reply({
    embeds: [
      embed(
        "🏓 Pong!",
        `Latency: **${client.ws.ping}ms**`,
        0x57F287
      ),
    ],
  });
}

// !help
if (command === "help") {
  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("📖 Taver Moderation")
        .setDescription("Available Commands")
        .addFields(
          { name: "🏓 !ping", value: "Shows bot latency.", inline: true },
          { name: "📖 !help", value: "Shows this menu.", inline: true },
          { name: "👤 !userinfo", value: "Shows your user information.", inline: true }
        )
        .setTimestamp(),
    ],
  });
}

// !userinfo
if (command === "userinfo") {
  const user = message.mentions.users.first() || message.author;

  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle("👤 User Information")
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          {
            name: "Username",
            value: user.tag,
            inline: true,
          },
          {
            name: "ID",
            value: user.id,
            inline: true,
          },
          {
            name: "Account Created",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          }
        )
        .setTimestamp(),
    ],
  });
}


client.login(process.env.DISCORD_TOKEN);