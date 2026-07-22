const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
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
👤 /userinfo - Show your user information.
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
  }
});

client.login(process.env.DISCORD_TOKEN);