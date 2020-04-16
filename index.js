const { Client, Collection, RichEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const func = require("./functions.js");
const econ = require("./economy.js");
const respond = require("./respond.json");
const profanity = require("@2toad/profanity").profanity;
const { stripIndents } = require("common-tags");

profanity.removeWords([
  "butt",
  "butts",
  "sex",
  "crap",
  "pissed",
  "bloody",
  "homo"
]);
profanity.addWords(["what the hell"]);

const client = new Client({
  disableEveryone: true
});

const cooldowns = new Collection();

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

client.queue = new Map();

config({
  path: __dirname + "/.env"
});

let dev = process.env.DEVELOPER.split(",");

["command"].forEach(handler => {
  require(`./handler/${handler}`)(client);
});

// Online!
client.on("ready", () => {
  console.log(`${client.user.username} is now online!`);

  client.user.setPresence({
    status: "online",
    game: {
      name: `in ${client.guilds.size} servers.`,
      type: "PLAYING"
    }
  });
  client.log(
    `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`,
    "Ready",
    "event"
  );
});

client.on("guildMemberAdd", member => {
  const guild = member.guild;
  const defaultChannel = guild.channels.find("name", "announcements");
  defaultChannel.send(`Welcome to ${guild.name}, <@${member.id}>!`);

  member.send(stripIndents`Hi, <@${member.id}>! Welcome to ${guild.name}! I am TheThunderBot, a bot created by <@${process.env.DEVELOPER}>!
                          A couple of my features are Music, Moderation, and Currency! Use '!help' to get a list of my commands!
                          Make sure to check out the rules, and enjoy your time with ${guild.name}!`);
});

client.on("message", async message => {
  const prefix = "!";

  if (profanity.exists(message.content) && false) {
    message.delete();
    message.reply("You cannot say that!").then(m => m.delete(5000));
    message.channel.send("!mute <@" + message.author.id + "> 2 Banned word");
    return;
  }

  Object.keys(respond).forEach(function(key) {
    if (message.content.toLowerCase().includes(key) && message.guild.id != "264445053596991498") {
      return message.channel.send(respond[key]);
    }
  });

  if (!message.author.bot && !message.content.startsWith(prefix) && message.guild.id != "264445053596991498") {
    let xpAmount = Math.floor(Math.random() * 10) + 15;
    let baseXpAmount = Math.floor(Math.random() * 10) + 15;

    if (xpAmount === baseXpAmount) {
      econ.gainXP(message, xpAmount);
    }

    let coinAmount = Math.floor(Math.random() * 15) + 1;
    let baseAmount = Math.floor(Math.random() * 15) + 1;
    //console.log(`${coinAmount}, ${baseAmount}`);

    if (coinAmount === baseAmount) {
      var modif = 1;
      //modif = Math.ceil(econ.getLevel(message, false) / 2);

      econ.gainMoney(message, coinAmount * modif);

      message
        .reply(`You found ${coinAmount * modif} coins!`)
        .then(m => m.delete(3000));
    }
  }

  if (!message.content.startsWith(prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) {
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        message.reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        );
        message.channel.bulkDelete(2, true).catch(err => {
          console.error(err);
        });
        return;
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    command.run(client, message, args);
  }
});

client.log = async (content, title, type) => {
  let embed = new RichEmbed()
    .setTitle(title)
    .setDescription(content.toString().substr(0, 2048))
    .setColor("0083ff")
    .setTimestamp();

  if (type === "event") {
    client.channels.get(process.env.DEVCHANNEL).send(embed);
  } else if (type === "error") {
    client.channels.get(process.env.DEVCHANNEL).send(embed);
  } else if (type === "joinleave") {
    client.channels.get(process.env.DEVCHANNEL).send(`<@${process.env.DEVELOPER}>`);
    client.channels.get(process.env.DEVCHANNEL).send(embed);
  }
};

client.login(process.env.TOKEN);
