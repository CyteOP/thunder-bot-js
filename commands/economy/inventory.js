const { getInv } = require("../../economy.js");

module.exports = {
  name: "inventory",
  category: "economy",
  description: "Shows Your Inventory.",
  aliases: ["inven", "stuff"],
  cooldown: 3,
  run: async (client, message, args) => {
    getInv(message);
  }
};
