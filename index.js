const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

require("dotenv").config();


// ==========================
// Client Setup
// ==========================

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent,

  ],

});


// ==========================
// Variables
// ==========================

const PREFIX = "!";


// Warning storage
const warnings = new Map();


// Mod log channel
const LOG_CHANNEL = "mod-logs";


// Auto moderation words
const badWords = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
];


// ==========================
// Ready Event
// ==========================

client.once("ready", () => {

  console.log(`✅ ${client.user.tag} is online!`);

  client.user.setActivity("!help");

});// ==========================
// Message Create Event
// ==========================

client.on("messageCreate", async (message) => {


  if (message.author.bot) return;

  if (!message.guild) return;



  // ==========================
  // Auto Moderation
  // ==========================

  const content = message.content.toLowerCase();



  const foundBadWord = badWords.some(word =>
    content.includes(word)
  );



  if (foundBadWord) {


    try {


      await message.delete();



      const warning = await message.channel.send(
        `⚠️ ${message.author}, please watch your language.`
      );



      setTimeout(() => {

        warning.delete().catch(() => {});

      }, 5000);



    } catch (error) {

      console.log(error);

    }



    return;

  }



  // ==========================
  // Prefix Check
  // ==========================

  if (!message.content.startsWith(PREFIX)) return;



  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +);



  const command = args.shift().toLowerCase();// ==========================
// !ping
// ==========================

if (command === "ping") {


  const pingEmbed = new EmbedBuilder()

    .setColor(0x57F287)

    .setTitle("🏓 Pong!")

    .setDescription(
      `Bot latency: **${client.ws.ping}ms**`
    )

    .setTimestamp();



  return message.reply({

    embeds: [pingEmbed],

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
      "Professional Discord Moderation Bot\n\nAvailable Commands:"
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
// ==========================
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
      },

      {
        name: "User ID",
        value: user.id,
      },

      {
        name: "Account Created",
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
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

    .setImage(
      user.displayAvatarURL({
        dynamic: true,
        size: 1024,
      })
    )

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
      },

      {
        name: "Server ID",
        value: guild.id,
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

}
// ==========================
// !ban
// ==========================

if (command === "ban") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {

    return message.reply(
      "❌ You need Ban Members permission."
    );

  }



  const member = message.mentions.members.first();



  if (!member) {

    return message.reply(
      "❌ Example: `!ban @user reason`"
    );

  }



  if (!member.bannable) {

    return message.reply(
      "❌ I cannot ban this user."
    );

  }



  const reason = args.slice(1).join(" ") || "No reason provided";



  await member.ban({

    reason: reason,

  });



  const logEmbed = new EmbedBuilder()

    .setColor(0xFF0000)

    .setTitle("🔨 Member Banned")

    .addFields(

      {
        name: "User",
        value: member.user.tag,
      },

      {
        name: "Moderator",
        value: message.author.tag,
      },

      {
        name: "Reason",
        value: reason,
      }

    )

    .setTimestamp();



  const logChannel = message.guild.channels.cache.find(
    channel => channel.name === LOG_CHANNEL
  );



  if (logChannel) {

    logChannel.send({

      embeds: [logEmbed],

    });

  }



  return message.reply(
    `🔨 **${member.user.tag}** has been banned.`
  );

}



// ==========================
// !kick
// ==========================

if (command === "kick") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {

    return message.reply(
      "❌ You need Kick Members permission."
    );

  }



  const member = message.mentions.members.first();



  if (!member) {

    return message.reply(
      "❌ Example: `!kick @user reason`"
    );

  }



  if (!member.kickable) {

    return message.reply(
      "❌ I cannot kick this user."
    );

  }



  const reason = args.slice(1).join(" ") || "No reason provided";



  await member.kick(reason);



  const logEmbed = new EmbedBuilder()

    .setColor(0xFFA500)

    .setTitle("👢 Member Kicked")

    .addFields(

      {
        name: "User",
        value: member.user.tag,
      },

      {
        name: "Moderator",
        value: message.author.tag,
      },

      {
        name: "Reason",
        value: reason,
      }

    )

    .setTimestamp();



  const logChannel = message.guild.channels.cache.find(
    channel => channel.name === LOG_CHANNEL
  );



  if (logChannel) {

    logChannel.send({

      embeds: [logEmbed],

    });

  }



  return message.reply(
    `👢 **${member.user.tag}** has been kicked.`
  );

}
// ==========================
// !timeout
// ==========================

if (command === "timeout") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {

    return message.reply(
      "❌ You need Moderate Members permission."
    );

  }



  const member = message.mentions.members.first();



  if (!member) {

    return message.reply(
      "❌ Example: `!timeout @user 10m reason`"
    );

  }



  const time = args[1];



  if (!time) {

    return message.reply(
      "❌ Add a time. Example: `10m`, `1h`, `1d`"
    );

  }



  const amount = parseInt(time);



  const unit = time.slice(-1);



  let duration;



  if (unit === "m") {

    duration = amount * 60 * 1000;

  } 

  else if (unit === "h") {

    duration = amount * 60 * 60 * 1000;

  } 

  else if (unit === "d") {

    duration = amount * 24 * 60 * 60 * 1000;

  } 

  else {

    return message.reply(
      "❌ Invalid time format."
    );

  }



  const reason = args.slice(2).join(" ") || "No reason provided";



  await member.timeout(duration, reason);



  return message.reply(
    `⏳ **${member.user.tag}** has been timed out for ${time}.\nReason: ${reason}`
  );

}



// ==========================
// !untimeout
// ==========================

if (command === "untimeout") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {

    return message.reply(
      "❌ You need Moderate Members permission."
    );

  }



  const member = message.mentions.members.first();



  if (!member) {

    return message.reply(
      "❌ Example: `!untimeout @user`"
    );

  }



  await member.timeout(null);



  return message.reply(
    `✅ **${member.user.tag}** timeout removed.`
  );

}
// ==========================
// !warn
// ==========================

if (command === "warn") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {

    return message.reply(
      "❌ You need Moderate Members permission."
    );

  }



  const member = message.mentions.members.first();



  if (!member) {

    return message.reply(
      "❌ Example: `!warn @user reason`"
    );

  }



  const reason = args.slice(1).join(" ") || "No reason provided";



  if (!warnings.has(member.id)) {

    warnings.set(member.id, []);

  }



  warnings.get(member.id).push({

    reason: reason,

    moderator: message.author.tag,

    date: new Date().toLocaleString(),

  });



  return message.reply(
    `⚠️ **${member.user.tag}** has received a warning.\nReason: ${reason}`
  );

}



// ==========================
// !warnings
// ==========================

if (command === "warnings") {


  const member = message.mentions.members.first() || message.member;



  const userWarnings = warnings.get(member.id);



  if (!userWarnings || userWarnings.length === 0) {

    return message.reply(
      `✅ **${member.user.tag}** has no warnings.`
    );

  }



  const warningList = userWarnings.map((warn, index) => {


    return (

      `**${index + 1}.** ${warn.reason}\n` +

      `Moderator: ${warn.moderator}\n` +

      `Date: ${warn.date}`

    );


  }).join("\n\n");



  const warningEmbed = new EmbedBuilder()

    .setColor(0xFFA500)

    .setTitle(`⚠️ Warnings for ${member.user.tag}`)

    .setDescription(warningList)

    .setTimestamp();



  return message.reply({

    embeds: [warningEmbed],

  });

}
// ==========================
// !clear
// ==========================

if (command === "clear") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

    return message.reply(
      "❌ You need Manage Messages permission."
    );

  }



  const amount = parseInt(args[0]);



  if (!amount || amount < 1 || amount > 100) {

    return message.reply(
      "❌ Example: `!clear 50`\nMaximum: 100 messages."
    );

  }



  await message.channel.bulkDelete(amount, true);



  const clearMessage = await message.channel.send(
    `🧹 Deleted **${amount} messages**.`
  );



  setTimeout(() => {

    clearMessage.delete().catch(() => {});

  }, 3000);


}



// ==========================
// !lock
// ==========================

if (command === "lock") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {

    return message.reply(
      "❌ You need Manage Channels permission."
    );

  }



  await message.channel.permissionOverwrites.edit(

    message.guild.roles.everyone,

    {
      SendMessages: false,
    }

  );



  return message.reply(
    "🔒 Channel locked."
  );

}



// ==========================
// !unlock
// ==========================

if (command === "unlock") {


  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {

    return message.reply(
      "❌ You need Manage Channels permission."
    );

  }



  await message.channel.permissionOverwrites.edit(

    message.guild.roles.everyone,

    {
      SendMessages: true,
    }

  );



  return message.reply(
    "🔓 Channel unlocked."
  );

}
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

}



// ==========================
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
      `Closed by ${message.author.tag}`
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

}



// ==========================
// End Message Event
// ==========================

});



// ==========================
// Login
// ==========================

client.login(process.env.DISCORD_TOKEN);