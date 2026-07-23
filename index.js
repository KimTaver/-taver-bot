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
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = "!";

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);

  client.user.setActivity("!help | Taver Moderation", {
    type: ActivityType.Playing,
  });

  client.user.setStatus("online");
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
          .setAuthor({
            name: "Taver Moderation",
            iconURL: client.user.displayAvatarURL(),
          })
          .setTitle("📖 Commands")
          .setDescription("Available moderation commands")
          .addFields(
            { name: "🏓 !ping", value: "Shows bot latency." },
            { name: "👤 !userinfo", value: "Shows user information." },
            { name: "🔨 !ban @user reason", value: "Ban a member." },
            { name: "👢 !kick @user reason", value: "Kick a member." },
            {
              name: "⏳ !timeout @user minutes reason",
              value: "Timeout a member.",
            },
            {
              name: "🔓 !untimeout @user",
              value: "Remove timeout.",
            }
          )
          .setFooter({ text: "Taver Moderation" })
          .setTimestamp(),
      ],
    });
  }

  // !userinfo
  if (command === "userinfo") {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x3498DB)
          .setTitle("👤 User Information")
          .setThumbnail(message.author.displayAvatarURL())
          .addFields(
            {
              name: "Username",
              value: message.author.tag,
              inline: true,
            },
            {
              name: "ID",
              value: message.author.id,
              inline: true,
            },
            {
              name: "Created",
              value: `<t:${Math.floor(
                message.author.createdTimestamp / 1000
              )}:F>`,
            }
          )
          .setTimestamp(),
      ],
    });
  }

  // !ban
  if (command === "ban") {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    )
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention a user.");

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply(
        "❌ You can't ban someone with an equal or higher role."
      );

    const reason = args.slice(1).join(" ") || "No reason provided.";

    try {
      await member.send(
        `You have been banned from **${message.guild.name}**.\nReason: ${reason}`
      );
    } catch {}

    try {
      await member.ban({ reason });

      return message.reply({
        embeds: [
          embed(
            "🔨 Member Banned",
            `${member.user.tag} has been banned.`,
            0xed4245
          ).addFields(
            {
              name: "Moderator",
              value: message.author.tag,
              inline: true,
            },
            {
              name: "Reason",
              value: reason,
              inline: true,
            }
          ),
        ],
      });
    } catch {
      return message.reply("❌ Failed to ban member.");
    }
  }  // !kick
  if (command === "kick") {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.KickMembers
      )
    )
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention a user.");

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply(
        "❌ You can't kick someone with an equal or higher role."
      );

    const reason = args.slice(1).join(" ") || "No reason provided.";

    try {
      await member.send(
        `You have been kicked from **${message.guild.name}**.\nReason: ${reason}`
      );
    } catch {}

    try {
      await member.kick(reason);

      return message.reply({
        embeds: [
          embed(
            "👢 Member Kicked",
            `${member.user.tag} has been kicked.`,
            0xFAA61A
          ).addFields(
            {
              name: "Moderator",
              value: message.author.tag,
              inline: true,
            },
            {
              name: "Reason",
              value: reason,
              inline: true,
            }
          ),
        ],
      });
    } catch {
      return message.reply("❌ Failed to kick member.");
    }
  }
// !purge
if (command === "purge") {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
    return message.reply("❌ You don't have permission.");

  const amount = parseInt(args[0]);

  if (isNaN(amount) || amount < 1 || amount > 100)
    return message.reply("❌ Enter a number between 1 and 100.");

  try {
    await message.channel.bulkDelete(amount, true);

    const msg = await message.channel.send({
      embeds: [
        embed(
          "🧹 Messages Deleted",
          `Successfully deleted **${amount}** messages.`,
          0x57F287
        ),
      ],
    });

    setTimeout(() => msg.delete().catch(() => {}), 5000);
  } catch {
    message.reply("❌ Failed to delete messages.");
  }
}
  // !timeout
  if (command === "timeout") {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    )
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention a user.");

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply(
        "❌ You can't timeout someone with an equal or higher role."
      );

    const minutes = parseInt(args[1]);
    if (isNaN(minutes) || minutes <= 0)
      return message.reply("Please provide a valid number of minutes.");

    const reason = args.slice(2).join(" ") || "No reason provided.";

    try {
      await member.send(
        `You have been timed out in **${message.guild.name}** for **${minutes}** minute(s).\nReason: ${reason}`
      );
    } catch {}

    try {
      await member.timeout(minutes * 60 * 1000, reason);

      return message.reply({
        embeds: [
          embed(
            "⏳ Member Timed Out",
            `${member.user.tag} has been timed out.`,
            0xFEE75C
          ).addFields(
            {
              name: "Duration",
              value: `${minutes} minute(s)`,
              inline: true,
            },
            {
              name: "Moderator",
              value: message.author.tag,
              inline: true,
            },
            {
              name: "Reason",
              value: reason,
              inline: false,
            }
          ),
        ],
      });
    } catch {
      return message.reply("❌ Failed to timeout member.");
    }
  }

  // !untimeout
  if (command === "untimeout") {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    )
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention a user.");

    try {
      await member.timeout(null);

      return message.reply({
        embeds: [
          embed(
            "✅ Timeout Removed",
            `${member.user.tag}'s timeout has been removed.`,
            0x57F287
          ).addFields({
            name: "Moderator",
            value: message.author.tag,
            inline: true,
          }),
        ],
      });
    } catch {
      return message.reply("❌ Failed to remove timeout.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);