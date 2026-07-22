require("dotenv").config();

const {
Client,
Collection,
GatewayIntentBits,
Partials
} = require("discord.js");

const fs = require("fs");

const client = new Client({

intents: [

GatewayIntentBits.Guilds,

GatewayIntentBits.GuildMembers,

GatewayIntentBits.GuildMessages,

GatewayIntentBits.MessageContent

],

partials: [

Partials.Channel

]

});

client.commands = new Collection();

const commandFiles = fs

.readdirSync("./commands")

.filter(file => file.endsWith(".js"));

for (const file of commandFiles){

const command = require(`./commands/${file}`);

client.commands.set(command.name, command);

}

const eventFiles = fs

.readdirSync("./events")

.filter(file => file.endsWith(".js"));

for(const file of eventFiles){

const event = require(`./events/${file}`);

event(client);

}

client.login(process.env.DISCORD_TOKEN);