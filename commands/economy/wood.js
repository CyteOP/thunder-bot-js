const { RichEmbed } = require("discord.js");
const econ = require("../../economy.js");

module.exports = {
  name: "wood",
  category: "economy",
  description: "Chop wood.",
  cooldown: 5,
  run: async (client, message, args) => {
    econ.getWood(message);
  }
};
