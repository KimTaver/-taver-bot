const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all bot commands."),

  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Shows information about a user."),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("User to ban").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason"))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("User to kick").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason"))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("User to timeout").setRequired(true))
    .addIntegerOption(option =>
      option.setName("minutes").setDescription("Minutes").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove a member's timeout.")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
].map(command => command.toJSON());

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log("Slash commands registered!");
  } catch (error) {
    console.error(error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "ping":
      await interaction.reply("🏓 Pong!");
      break;

    case "help":
      await interaction.reply(`
**📜 Available Commands**
🏓 /ping - Check if the bot is online.
❓ /help - Show all commands.
👤 /userinfo - Show your information.
🔨 /ban - Ban a member.
👢 /kick - Kick a member.
⏳ /timeout - Timeout a member.
🔓 /untimeout - Remove a timeout.
`);
      break;

    case "userinfo":
      await interaction.reply(`
**👤 User Information**
Username: ${interaction.user.username}
ID: ${interaction.user.id}
Created: <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:F>
`);
      break;

    case "ban": {
      const member = interaction.options.getMember("user");
      const reason = interaction.options.getString("reason") || "No reason provided";

      if (!member)
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });

      try {
        await member.ban({ reason });
        await interaction.reply(`🔨 **${member.user.tag}** has been banned.\nReason: ${reason}`);
      } catch {
        await interaction.reply({ content: "❌ I couldn't ban that member.", ephemeral: true });
      }
      break;
    }

    case "kick": {
      const member = interaction.options.getMember("user");
      const reason = interaction.options.getString("reason") || "No reason provided";

      if (!member)
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });

      try {
        await member.kick(reason);
        await interaction.reply(`👢 **${member.user.tag}** has been kicked.\nReason: ${reason}`);
      } catch {
        await interaction.reply({ content: "❌ I couldn't kick that member.", ephemeral: true });
      }
      break;
    }

    case "timeout": {
      const member = interaction.options.getMember("user");
      const minutes = interaction.options.getInteger("minutes");
      const reason = interaction.options.getString("reason") || "No reason provided";

      if (!member)
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });

      try {
        await member.timeout(minutes * 60 * 1000, reason);
        await interaction.reply(`⏳ **${member.user.tag}** has been timed out for **${minutes}** minute(s).\nReason: ${reason}`);
      } catch {
        await interaction.reply({ content: "❌ I couldn't timeout that member.", ephemeral: true });
      }
      break;
    }

    case "untimeout": {
      const member = interaction.options.getMember("user");

      if (!member)
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });

      try {
        await member.timeout(null);
        await interaction.reply(`🔓 Timeout removed for **${member.user.tag}**.`);
      } catch {
        await interaction.reply({ content: "❌ I couldn't remove the timeout.", ephemeral: true });
      }
      break;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);