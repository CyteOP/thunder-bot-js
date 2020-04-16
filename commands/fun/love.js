const { RichEmbed } = require("discord.js");
const { getMember } = require("../../functions.js");

module.exports = {
  name: "love",
  aliases: ["affinity"],
  category: "fun",
  description: "Calculates the love affinity you have for another person.",
  usage:
    "[mention | id | username] [gf | bf | child | parent | sibling | homie]",
  guildOnly: true,
  run: async (client, message, args) => {
    if (message.deletable) {
      message.delete();
    }
    // Get a member from mention, id, or username
    let person = getMember(message, args[0]);

    if (!person) {
      person = message.guild.members
        .filter(m => m.id !== message.author.id)
        .random();
    }

    var loveProb = Math.random() * 100;
    if (args[1] !== undefined) {
      args[1] = args[1].toLowerCase();
      if (args[1] === "gf") {
        loveProb = 50 + Math.random() * 50;
      } else if (
        args[1] === "bf" ||
        args[1] === "child" ||
        args[1] === "parent"
      ) {
        loveProb = 25 + Math.random() * 75;
      } else if (args[1] === "sibling") {
        loveProb = 0;
      } else if (args[1] === "homie") {
        loveProb = 200;
      }
    }

    // love is the percentage
    // loveIndex is a number from 0 to 10, based on that love variable
    const love = loveProb;
    const loveIndex = love <= 100 ? Math.floor(love / 10) : 10;
    const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

    const embed = new RichEmbed()
      .setColor("#ffb6c1")
      .addField(
        `**${person.displayName}** loves **${message.member.displayName}** this much:`,
        `💟 ${Math.floor(love)}%\n\n${loveLevel}`
      );

    message.channel.send(embed);
  }
};
