const { selectJob } = require("../../economy.js");

module.exports = {
  name: "job",
  category: "economy",
  description: "Select your job.",
  usage: "<Fisherman, Lumberjack, Miner, Farmer, Hunter>",
  cooldown: 0,
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.reply(
        "Please select one of these jobs: Fisherman, Lumberjack, Miner, Farmer, Hunter"
      );
    }

    var opt = args[0].toLowerCase();
    selectJob(message, opt);
  }
};
