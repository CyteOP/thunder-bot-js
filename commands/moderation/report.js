const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const curl = require("curlrequest");

const mongoose = require("mongoose");
const Report = require("../../models/report.js");

module.exports = {
  name: "report",
  category: "moderation",
  description: "Reports a member",
  usage: "<mention, id> <reason>",
  guildOnly: true,
  cooldown: 10,
  run: async (client, message, args) => {
    const uri =
      "mongodb+srv://bot:botpw@discordbot-nleos.mongodb.net/DiscordBot?retryWrites=true&w=majority";
    const dbClient = mongoose.connect(uri, { useNewUrlParser: true });


    if (message.deletable) message.delete();

    let rMember =
      message.mentions.members.first() || message.guild.members.get(args[0]);

    if (!rMember)
      return message
        .reply("Couldn't find that person?")
        .then(m => m.delete(5000));

    if (
      rMember.hasPermission("BAN_MEMBERS") ||
      rMember.user.bot
    )
      return message.channel
        .send("Can't report that member")
        .then(m => m.delete(5000));

    if (!args[1])
      return message.channel
        .send("Please provide a reason for the report")
        .then(m => m.delete(5000));

    const channel = message.guild.channels.find(c => c.name === "modlogs");

    if (!channel)
      return message.channel
        .send("Couldn't find a `#modlogs` channel")
        .then(m => m.delete(5000));

    const embed = new RichEmbed()
      .setColor("#ff0000")
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL)
      .setAuthor("Reported member", rMember.user.displayAvatarURL)
      .setDescription(stripIndents`**- Member:** ${rMember} (${rMember.user.id})
            **- Reported by:** ${message.member}
            **- Reported in:** ${message.channel}
            **- Reason:** ${args.slice(1).join(" ")}`);

    const report = new Report({
      _id: mongoose.mongo.ObjectID(),
      username: rMember.user.username,
      userID: rMember.id,
      reason: args.slice(1).join(" "),
      rUsername: message.author.username,
      rID: message.author.id,
      time: message.createdAt
    });

    report
      .save()
      .then(result => console.log(result))
      .catch(err => console.log(err));

    return channel.send(embed);
  }
};
