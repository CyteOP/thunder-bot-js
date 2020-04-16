const { harvest } = require("../../economy.js");

module.exports = {
  name: "grain",
  category: "economy",
  description: "Harvest some grain.",
  aliases: ["harvest"],
  cooldown: 2,
  run: async (client, message, args) => {
    harvest(message);
  }
};
