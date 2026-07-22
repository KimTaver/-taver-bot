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
        {
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