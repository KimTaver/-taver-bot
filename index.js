const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
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

function createEmbed(title, description, color) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setThumbnail(client.user.displayAvatarURL())
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


  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/);

  const command = args.shift().toLowerCase();


  // ==========================
  // !ping
  // ==========================
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


  // ==========================
  // !help
  // ==========================
  if (command === "help") {

    const helpEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🛡️ Taver Moderation")
      .setDescription(
        "Professional Discord Moderation Bot\n\n**Available Commands**"
      )
      .addFields(
        {
          name: "📌 General",
          value:
            "`!ping`\n`!help`\n`!userinfo`\n`!avatar`\n`!serverinfo`\n`!botinfo`",
        },
        {
          name: "🛡️ Moderation",
          value:
            "`!ban`\n`!kick`\n`!timeout`\n`!untimeout`\n`!warn`\n`!clear`",
        }
      )
      .setTimestamp();

    return message.reply({
      embeds: [helpEmbed],
    });

  }  // ==========================
  // !userinfo
  // ==========================
  if (command === "userinfo") {

    const user = message.mentions.users.first() || message.author;

    const userEmbed = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle("👤 User Information")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "Username",
          value: user.tag,
          inline: true,
        },
        {
          name: "User ID",
          value: user.id,
          inline: true,
        }
      )
      .setTimestamp();

    return message.reply({
      embeds: [userEmbed],
    });

  }


  // ==========================
  // !avatar
  // ==========================
  if (command === "avatar") {

    const user = message.mentions.users.first() || message.author;

    const avatarEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    return message.reply({
      embeds: [avatarEmbed],
    });

  }


  // ==========================
  // !serverinfo
  // ==========================
  if (command === "serverinfo") {

    const guild = message.guild;

    const serverEmbed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("🏠 Server Information")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: "Server Name",
          value: guild.name,
        },
        {
          name: "Members",
          value: `${guild.memberCount}`,
        }
      )
      .setTimestamp();

    return message.reply({
      embeds: [serverEmbed],
    });

  }


  // ==========================
  // !botinfo
  // ==========================
  if (command === "botinfo") {

    const botEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🤖 Taver Moderation")
      .addFields(
        {
          name: "Bot Name",
          value: client.user.username,
        },
        {
          name: "Ping",
          value: `${client.ws.ping}ms`,
        },
        {
          name: "Library",
          value: "Discord.js v14",
        }
      )
      .setTimestamp();

    return message.reply({
      embeds: [botEmbed],
    });

  }// ==========================
// !timeout
// ==========================
if (command === "timeout") {

  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return message.reply("❌ You need Moderate Members permission.");
  }

  const member = message.mentions.members.first();

  if (!member) {
    return message.reply("❌ Example: `!timeout @user 10m reason`");
  }

  if (!member.moderatable) {
    return message.reply("❌ I cannot timeout this user. Check my role position.");
  }

  const time = args[1];

  if (!time) {
    return message.reply("❌ Example: `!timeout @user 10m Spamming`");
  }

  const reason = args.slice(2).join(" ") || "No reason provided";


  await member.timeout(convertTime(time), reason);


  return message.reply(
    `⏳ ${member.user.tag} has been timed out for ${time}\nReason: ${reason}`
  );
}  // ==========================
  // !ban
  // ==========================
  if (command === "ban") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("❌ You don't have permission to ban members.");
    }


    const member = message.mentions.members.first();


    if (!member) {
      return message.reply(
        "❌ Mention someone to ban.\nExample: `!ban @user reason`"
      );
    }


    if (!member.bannable) {
      return message.reply("❌ I cannot ban this user.");
    }


    const reason = args.join(" ") || "No reason provided";


    await member.ban({
      reason: reason,
    });


    return message.reply(
      `🔨 **${member.user.tag}** has been banned.\n**Reason:** ${reason}`
    );

  }



  // ==========================
  // !kick
  // ==========================
  if (command === "kick") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("❌ You don't have permission to kick members.");
    }


    const member = message.mentions.members.first();


    if (!member) {
      return message.reply(
        "❌ Mention someone to kick.\nExample: `!kick @user reason`"
      );
    }


    if (!member.kickable) {
      return message.reply("❌ I cannot kick this user.");
    }


    const reason = args.join(" ") || "No reason provided";


    await member.kick(reason);


    return message.reply(
      `👢 **${member.user.tag}** has been kicked.\n**Reason:** ${reason}`
    );

  }

});

client.login(process.env.DISCORD_TOKEN);