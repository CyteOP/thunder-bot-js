const { RichEmbed } = require("discord.js");
const { mine } = require("../../economy.js");

module.exports = {
  name: "mine",
  category: "economy",
  description: "Go mining.",
  cooldown: 6,
  run: async (client, message, args) => {
    mine(message);
  }
};
