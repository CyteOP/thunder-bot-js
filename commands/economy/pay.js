const { RichEmbed } = require("discord.js");
const { pay } = require("../../economy.js")

module.exports = {
  name: "pay",
  category: "economy",
  description: "Pay a user.",
  usage: "<Mention | ID> <Amount>",
  cooldown: 3,
  run: async (client, message, args) => {
    var cash = 0;
    if (!args[1]) {
      return message.reply("Please provide an amount to send.");
    }
    cash = Math.abs(parseInt(args[1]));
    let pUser =
      message.guild.member(message.mentions.members.first()) ||
      message.guild.members.get(args[0]);

    if (message.author.id === pUser.id) {
      return message.reply("You can't pay yourself!");
    }

    var result;
    try {
      result = await pay(message.author.id, pUser, cash, message.guild.id);
    } catch (err) {
      result = err;
      console.log(err);
    }

    message.reply(result).then(m => m.delete(5000));
  }
};