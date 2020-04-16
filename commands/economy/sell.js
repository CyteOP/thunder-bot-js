const { RichEmbed } = require("discord.js");
const { sell } = require("../../economy.js");

module.exports = {
  name: "sell",
  category: "economy",
  description: "Sell your stuff.",
  usage: "<Fish | Wood | Gems | Grain>",
  cooldown: 1,
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.reply("Please specify what you want to sell.");
    }

    var option = args[0].toLowerCase();
    sell(message, option);
  }
};
