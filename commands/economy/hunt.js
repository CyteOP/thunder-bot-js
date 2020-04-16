const { hunt } = require("../../economy.js");

module.exports = {
  name: "hunt",
  category: "economy",
  description: "Go Hunting.",
  cooldown: 8,
  run: async (client, message, args) => {
    hunt(message);
  }
};
