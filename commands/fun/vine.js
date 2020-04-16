const { RichEmbed } = require("discord.js");
const fs = require("fs");
const { generateRandomColor } = require("../../functions.js");
const readline = require("readline");
const curl = require("curlrequest");

var quotes;

curl.request(
  {
    url:
      "https://raw.githubusercontent.com/DuckLord25/discordbotquotes/master/vines.txt"
  },
  function(err, stdout, meta) {
    quotes = stdout.split("\n");
  }
);

module.exports = {
  name: "vine",
  category: "fun",
  description: "Sends a random vine.",
  guildOnly: true,
  run: async (client, message, args) => {
    if (message.deletable) {
      message.delete();
    }

    let index = Math.abs(Math.floor(Math.random() * quotes.length) - 1);

    if (args[0] !== undefined) {
      index = parseInt(args[0]) - 1;
    }

    message.channel.send(quotes[index]);
  }
};
