const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
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


client.once("ready", () => {

  console.log(`✅ ${client.user.tag} is online!`);

  client.user.setActivity("!ticket");

});



client.on("messageCreate", async (message) => {


  if (message.author.bot) return;

  if (!message.guild) return;

  if (!message.content.startsWith(PREFIX)) return;



  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +);



  const command = args.shift().toLowerCase();



  // ==========================
  // !ticket
  // ==========================
  if (command === "ticket") {


    const existingTicket = message.guild.channels.cache.find(
      channel =>
      channel.name === `ticket-${message.author.username}`
    );


    if (existingTicket) {

      return message.reply(
        `❌ You already have a ticket open: ${existingTicket}`
      );

    }



    const ticketChannel = await message.guild.channels.create({

      name: `ticket-${message.author.username}`,

      type: ChannelType.GuildText,

      permissionOverwrites: [

        {
          id: message.guild.roles.everyone,

          deny: [
            PermissionsBitField.Flags.ViewChannel,
          ],

        },


        {
          id: message.author.id,

          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],

        },


        {
          id: client.user.id,

          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],

        },

      ],

    });



    const ticketEmbed = new EmbedBuilder()

      .setColor(0x5865F2)

      .setTitle("🎫 Ticket Created")

      .setDescription(
        "Please explain your issue.\nA staff member will assist you soon.\n\nUse `!close` to close this ticket."
      )

      .setTimestamp();



    ticketChannel.send({
      content: `${message.author}`,
      embeds: [ticketEmbed],
    });



    return message.reply(
      `✅ Ticket created: ${ticketChannel}`
    );

  }  // ==========================
  // !close
  // ==========================
  if (command === "close") {


    if (!message.channel.name.startsWith("ticket-")) {

      return message.reply(
        "❌ This is not a ticket channel."
      );

    }



    const closeEmbed = new EmbedBuilder()

      .setColor(0xFF0000)

      .setTitle("🔒 Ticket Closed")

      .setDescription(
        `Ticket closed by ${message.author.tag}`
      )

      .setTimestamp();



    await message.channel.send({
      embeds: [closeEmbed],
    });



    setTimeout(() => {

      message.channel.delete().catch(() => {});

    }, 3000);



  }



  // ==========================
  // !add
  // ==========================
  if (command === "add") {


    if (!message.channel.name.startsWith("ticket-")) {

      return message.reply(
        "❌ This is not a ticket channel."
      );

    }



    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {

      return message.reply(
        "❌ You need Manage Channels permission."
      );

    }



    const member = message.mentions.members.first();



    if (!member) {

      return message.reply(
        "❌ Example: `!add @user`"
      );

    }



    await message.channel.permissionOverwrites.edit(
      member.id,
      {
        ViewChannel: true,
        SendMessages: true,
      }
    );



    return message.reply(
      `✅ ${member.user.tag} added to the ticket.`
    );

  }



  // ==========================
  // !remove
  // ==========================
  if (command === "remove") {


    if (!message.channel.name.startsWith("ticket-")) {

      return message.reply(
        "❌ This is not a ticket channel."
      );

    }



    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {

      return message.reply(
        "❌ You need Manage Channels permission."
      );

    }



    const member = message.mentions.members.first();



    if (!member) {

      return message.reply(
        "❌ Example: `!remove @user`"
      );

    }



    await message.channel.permissionOverwrites.delete(
      member.id
    );



    return message.reply(
      `✅ ${member.user.tag} removed from the ticket.`
    );

  }  // ==========================
  // !ping
  // ==========================
  if (command === "ping") {

    return message.reply(
      `🏓 Pong! ${client.ws.ping}ms`
    );

  }



  // ==========================
  // !help
  // ==========================
  if (command === "help") {

    const helpEmbed = new EmbedBuilder()

      .setColor(0x5865F2)

      .setTitle("🛡️ Taver Moderation")

      .setDescription(
        "Professional Discord Moderation Bot"
      )

      .addFields(
        {
          name: "General",
          value:
          "`!ping`\n`!help`\n`!userinfo`\n`!avatar`\n`!serverinfo`\n`!botinfo`",
        },

        {
          name: "Moderation",
          value:
          "`!ban`\n`!kick`\n`!timeout`\n`!untimeout`\n`!warn`\n`!warnings`\n`!clear`\n`!lock`\n`!unlock`",
        },

        {
          name: "Tickets",
          value:
          "`!ticket`\n`!close`\n`!add`\n`!remove`",
        }
      )

      .setTimestamp();



    return message.reply({
      embeds: [helpEmbed],
    });

  }



});


client.login(process.env.DISCORD_TOKEN);