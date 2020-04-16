const { getLevel } = require("../../economy.js");

module.exports = {
  name: "level",
  category: "economy",
  description: "Shows Your Level.",
  aliases: ["lvl", "rank"],
  cooldown: 3,
  run: async (client, message, args) => {
    getLevel(message, true);
  }
};
