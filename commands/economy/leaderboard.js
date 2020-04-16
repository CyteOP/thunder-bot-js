const { leaderboard } = require("../../economy.js");

module.exports = {
  name: "leaderboard",
  category: "economy",
  description: "Check the Leaderboard.",
  cooldown: 3,
  run: async (client, message, args) => {
    leaderboard(message);
  }
};
