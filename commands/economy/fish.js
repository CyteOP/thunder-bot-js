const { fish } = require("../../economy.js");

module.exports = {
  name: "fish",
  category: "economy",
  description: "Go fishing.",
  cooldown: 2,
  run: async (client, message, args) => {
    fish(message);
  }
};
