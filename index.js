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

// Embed Creator
function createEmbed(title, description, color) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} is online!`);
  client.user.setActivity("!help");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // !ping
  if (command === "ping") {
    return message.reply({
      embeds: [
        createEmbed(
          "🏓 Pong!",
          `Bot latency: **${client.ws.ping}ms**`,
          0x57F287
        ),
      ],
    });
  }

  // !help
  if (command === "help") {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🛡️ Taver Moderation")
      .setDescription("Professional Discord Moderation Bot")
      .addFields(
        {
          name: "🏓 General",
          value:
            "`!ping` - Check bot latency\n`!help` - Show this help menu",
        },
          // !userinfo
  if (command === "userinfo") {
    const user = message.mentions.users.first() || message.author;

    const userEmbed = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle("👤 User Information")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Username", value: user.tag, inline: true },
        { name: "User ID", value: user.id, inline: true },
        {
          name: "Account Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        }
      )
      .setTimestamp();

    return message.reply({ embeds: [userEmbed] });
  }

  // !avatar
  if (command === "avatar") {
    const user = message.mentions.users.first() || message.author;

    const avatarEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    return message.reply({ embeds: [avatarEmbed] });
  }

  // !serverinfo
  if (command === "serverinfo") {
    const guild = message.guild;

    const serverEmbed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("🏠 Server Information")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "Server", value: guild.name, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Owner ID", value: guild.ownerId, inline: true },
        {
          name: "Created",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
        }
      )
      .setTimestamp();

    return message.reply({ embeds: [serverEmbed] });
  }

  // !botinfo
  if (command === "botinfo") {
    const botEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🤖 Taver Moderation")
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: "Version", value: "3.0.0", inline: true },
        { name: "Library", value: "Discord.js v14", inline: true },
        { name: "Ping", value: `${client.ws.ping}ms`, inline: true }
      )
      .setFooter({ text: "Made with ❤️ by Taver" })
      .setTimestamp();

    return message.reply({ embeds: [botEmbed] });
  }{
          name: "🛡️ Moderation (Coming Soon)",
          value:
            "`!ban`\n`!kick`\n`!timeout`\n`!untimeout`\n`!warn`\n`!clear`",
        }
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    return message.reply({ embeds: [helpEmbed] });
  }
});

client.login(process.env.DISCORD_TOKEN);