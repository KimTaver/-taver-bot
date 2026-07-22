const {
  Client,
  Collection,
  GatewayIntentBits,
  ActivityType,
  Events,
} = require("discord.js");

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// Load Commands
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} is online!`);

  client.user.setActivity("/help | Taver Moderation", {
    type: ActivityType.Playing,
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ There was an error executing this command.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "❌ There was an error executing this command.",
        ephemeral: true,
      });
    }
  }
});
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User not found.",
        ephemeral: true,
      });
    }

    if (!member.bannable) {
      return interaction.reply({
        content: "❌ I can't ban this user.",
        ephemeral: true,
      });
    }

    try {
      await user.send(
        `You have been banned from **${interaction.guild.name}**.\nReason: ${reason}`
      );
    } catch {}

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle("🔨 Member Banned")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: "User",
          value: `${user.tag}`,
          inline: true,
        },
        {
          name: "Moderator",
          value: `${interaction.user.tag}`,
          inline: true,
        },
        {
          name: "Reason",
          value: reason,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to kick")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the kick")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User not found.",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "❌ I can't kick this user.",
        ephemeral: true,
      });
    }

    try {
      await user.send(
        `You have been kicked from **${interaction.guild.name}**.\nReason: ${reason}`
      );
    } catch {}

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor(0xFAA61A)
      .setTitle("👢 Member Kicked")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: "User",
          value: user.tag,
          inline: true,
        },
        {
          name: "Moderator",
          value: interaction.user.tag,
          inline: true,
        },
        {
          name: "Reason",
          value: reason,
        }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to timeout")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription("Duration in minutes")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320) // 28 days
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the timeout")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const minutes = interaction.options.getInteger("minutes");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User not found.",
        ephemeral: true,
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ I can't timeout this user.",
        ephemeral: true,
      });
    }

    try {
      await user.send(
        `You have been timed out in **${interaction.guild.name}** for **${minutes} minute(s)**.\nReason: ${reason}`
      );
    } catch {}

    await member.timeout(minutes * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle("⏳ Member Timed Out")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: "User",
          value: user.tag,
          inline: true,
        },
        {
          name: "Duration",
          value: `${minutes} minute(s)`,
          inline: true,
        },
        {
          name: "Moderator",
          value: interaction.user.tag,
          inline: true,
        },
        {
          name: "Reason",
          value: reason,
        }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove a member's timeout")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to remove timeout from")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User not found.",
        ephemeral: true,
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ I can't remove this user's timeout.",
        ephemeral: true,
      });
    }

    try {
      await member.timeout(null);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("✅ Timeout Removed")
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          {
            name: "User",
            value: user.tag,
            inline: true,
          },
          {
            name: "Moderator",
            value: interaction.user.tag,
            inline: true,
          }
        )
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);

      await interaction.reply({
        content: "❌ Failed to remove the timeout.",
        ephemeral: true,
      });
    }
  },
};

client.login(process.env.DISCORD_TOKEN);